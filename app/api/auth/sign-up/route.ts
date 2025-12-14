import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth'
import { UserRole, VerificationStatus } from '@prisma/client'
import { z } from 'zod'

const signUpSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
	name: z.string().min(2, 'Name must be at least 2 characters'),
	chapterId: z.string().min(1, 'Please select a chapter'),
})

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const validation = signUpSchema.safeParse(body)

		if (!validation.success) {
			return NextResponse.json(
				{ error: validation.error.errors[0].message },
				{ status: 400 }
			)
		}

		const { email, password, name, chapterId } = validation.data

		// Check if email already exists
		const existingUser = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		})

		if (existingUser) {
			return NextResponse.json(
				{ error: 'An account with this email already exists' },
				{ status: 400 }
			)
		}

		// Verify chapter exists
		const chapter = await prisma.chapter.findUnique({
			where: { id: chapterId },
		})

		if (!chapter) {
			return NextResponse.json(
				{ error: 'Selected chapter does not exist' },
				{ status: 400 }
			)
		}

		// Check if this email is a chapter admin
		const isChapterAdmin = chapter.adminEmails.includes(email.toLowerCase())

		// Hash password
		const hashedPassword = await hashPassword(password)

		// Create user
		const user = await prisma.user.create({
			data: {
				email: email.toLowerCase(),
				password: hashedPassword,
				name,
				chapterId,
				role: isChapterAdmin ? UserRole.CHAPTER_ADMIN : UserRole.STUDENT,
				// Chapter admins are auto-verified, students need verification
				verificationStatus: isChapterAdmin
					? VerificationStatus.APPROVED
					: VerificationStatus.PENDING,
			},
		})

		// Create session token
		const token = await createToken({
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
			chapterId: user.chapterId,
			verificationStatus: user.verificationStatus,
			tokenVersion: user.tokenVersion,
		})

		// Set auth cookie
		await setAuthCookie(token)

		return NextResponse.json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
				verificationStatus: user.verificationStatus,
			},
			message: isChapterAdmin
				? 'Account created. You are registered as a chapter admin.'
				: 'Account created. Pending verification by your chapter admin.',
		})
	} catch (error) {
		console.error('Sign-up error:', error)
		return NextResponse.json(
			{ error: 'An error occurred during sign-up' },
			{ status: 500 }
		)
	}
}

