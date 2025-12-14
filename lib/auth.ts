import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import prisma from './db'
import { UserRole, VerificationStatus } from '@prisma/client'

// CRITICAL: JWT_SECRET must be set in production
const JWT_SECRET_STRING = process.env.JWT_SECRET
if (!JWT_SECRET_STRING || JWT_SECRET_STRING.length < 32) {
	if (process.env.NODE_ENV === 'production') {
		throw new Error('JWT_SECRET environment variable must be set and at least 32 characters in production')
	}
	console.warn('⚠️ WARNING: JWT_SECRET not set or too short. Using development fallback. DO NOT USE IN PRODUCTION.')
}
const JWT_SECRET = new TextEncoder().encode(
	JWT_SECRET_STRING || 'dev-only-secret-key-minimum-32-chars'
)
const COOKIE_NAME = 'auth_token'
const TOKEN_EXPIRY = '7d'

export type SessionUser = {
	id: string
	email: string
	name: string
	role: UserRole
	chapterId: string | null
	verificationStatus: VerificationStatus
	tokenVersion: number // Used to invalidate sessions on password change
}

/**
 * Hash a password with bcrypt (includes salt)
 */
export async function hashPassword(password: string): Promise<string> {
	const saltRounds = 12
	return bcrypt.hash(password, saltRounds)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash)
}

/**
 * Create a JWT token for a user
 */
export async function createToken(user: SessionUser): Promise<string> {
	return new SignJWT({
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role,
		chapterId: user.chapterId,
		verificationStatus: user.verificationStatus,
		tokenVersion: user.tokenVersion,
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(TOKEN_EXPIRY)
		.sign(JWT_SECRET)
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<SessionUser | null> {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET)
		return payload as unknown as SessionUser
	} catch {
		return null
	}
}

/**
 * Get the current session from cookies
 */
export async function getSession(): Promise<SessionUser | null> {
	const cookieStore = await cookies()
	const token = cookieStore.get(COOKIE_NAME)?.value

	if (!token) return null

	return verifyToken(token)
}

/**
 * Get the current user from the database
 */
export async function getCurrentUser() {
	const session = await getSession()
	if (!session) return null

	const user = await prisma.user.findUnique({
		where: { id: session.id },
		include: { chapter: true },
	})

	return user
}

/**
 * Verify session is still valid by checking tokenVersion against DB
 * This ensures sessions are invalidated after password changes
 */
export async function verifySessionFresh(): Promise<SessionUser | null> {
	const session = await getSession()
	if (!session) return null

	// Check if tokenVersion matches the DB (for critical operations)
	const user = await prisma.user.findUnique({
		where: { id: session.id },
		select: { tokenVersion: true },
	})

	if (!user || user.tokenVersion !== session.tokenVersion) {
		// Token version mismatch - session has been invalidated
		return null
	}

	return session
}

/**
 * Invalidate all existing sessions for a user by incrementing tokenVersion
 */
export async function invalidateUserSessions(userId: string): Promise<void> {
	await prisma.user.update({
		where: { id: userId },
		data: { tokenVersion: { increment: 1 } },
	})
}

/**
 * Set auth cookie after login
 */
export async function setAuthCookie(token: string) {
	const cookieStore = await cookies()
	cookieStore.set(COOKIE_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 7, // 7 days
		path: '/',
	})
}

/**
 * Clear auth cookie on logout
 */
export async function clearAuthCookie() {
	const cookieStore = await cookies()
	cookieStore.delete(COOKIE_NAME)
}

/**
 * Check if the current user is a WTSA admin
 */
export async function isWTSAAdmin(): Promise<boolean> {
	const session = await getSession()
	if (!session) return false
	return session.role === UserRole.ADMIN
}

/**
 * Check if the current user is a chapter admin
 */
export async function isChapterAdmin(chapterId?: string): Promise<boolean> {
	const session = await getSession()
	if (!session) return false

	// WTSA admins can act as chapter admins
	if (session.role === UserRole.ADMIN) return true

	if (session.role !== UserRole.CHAPTER_ADMIN) return false

	// If specific chapter provided, check if user belongs to that chapter
	if (chapterId) {
		return session.chapterId === chapterId
	}

	return true
}

/**
 * Check if the current user is verified and can perform actions
 */
export async function isVerifiedUser(): Promise<boolean> {
	const session = await getSession()
	if (!session) return false

	// Admins and chapter admins are always verified
	if (session.role === UserRole.ADMIN || session.role === UserRole.CHAPTER_ADMIN) {
		return true
	}

	return session.verificationStatus === VerificationStatus.APPROVED
}

/**
 * Get all students pending verification for a chapter
 */
export async function getPendingStudents(chapterId: string) {
	return prisma.user.findMany({
		where: {
			chapterId,
			role: UserRole.STUDENT,
			verificationStatus: VerificationStatus.PENDING,
		},
		orderBy: { createdAt: 'desc' },
	})
}

/**
 * Verify a student (chapter admin action)
 */
export async function verifyStudent(
	studentId: string,
	adminId: string,
	approve: boolean
) {
	return prisma.user.update({
		where: { id: studentId },
		data: {
			verificationStatus: approve ? VerificationStatus.APPROVED : VerificationStatus.REJECTED,
			verifiedById: adminId,
			verifiedAt: new Date(),
		},
	})
}

/**
 * Reset a student's password (chapter admin action)
 * Generates a new temporary password
 */
export async function resetStudentPassword(studentId: string): Promise<string> {
	const tempPassword = generateTempPassword()
	const hashedPassword = await hashPassword(tempPassword)

	await prisma.user.update({
		where: { id: studentId },
		data: { password: hashedPassword },
	})

	return tempPassword
}

/**
 * Generate a cryptographically secure temporary password
 */
function generateTempPassword(): string {
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
	const randomBytes = crypto.getRandomValues(new Uint8Array(12))
	let password = ''
	for (let i = 0; i < 12; i++) {
		password += chars.charAt(randomBytes[i] % chars.length)
	}
	return password
}

/**
 * Get user's permissions for a specific chapter
 */
export async function getUserChapterPermissions(chapterId: string) {
	const session = await getSession()
	if (!session) {
		return {
			canManageChapter: false,
			canApproveStudents: false,
			canManageResources: false,
			canResetPasswords: false,
		}
	}

	const isAdmin = session.role === UserRole.ADMIN
	const isChapAdmin = session.role === UserRole.CHAPTER_ADMIN && session.chapterId === chapterId

	return {
		canManageChapter: isAdmin || isChapAdmin,
		canApproveStudents: isAdmin || isChapAdmin,
		canManageResources: isAdmin || isChapAdmin,
		canResetPasswords: isChapAdmin, // Only chapter admins, not WTSA admin
	}
}

/**
 * Get chapters for dropdown (used in sign-up)
 */
export async function getChaptersForSignUp() {
	return prisma.chapter.findMany({
		select: {
			id: true,
			name: true,
			schoolName: true,
		},
		orderBy: { name: 'asc' },
	})
}
