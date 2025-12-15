import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth'
import { z } from 'zod'

const signInSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const validation = signInSchema.safeParse(body)

		if (!validation.success) {
			return NextResponse.json(
				{ error: validation.error.errors[0].message },
				{ status: 400 }
			)
		}

		const { email, password } = validation.data

		// Find user by email
		const user = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
			include: { chapter: true },
		})

		if (!user) {
			return NextResponse.json(
				{ error: 'Invalid email or password' },
				{ status: 401 }
			)
		}

		// Verify password
		const isValidPassword = await verifyPassword(password, user.password)

		if (!isValidPassword) {
			return NextResponse.json(
				{ error: 'Invalid email or password' },
				{ status: 401 }
			)
		}

		// Block sign-in if not approved
		if (user.verificationStatus !== 'APPROVED') {
			return NextResponse.json(
				{ error: 'Your account is not approved yet. Please wait for your chapter admin to approve you.' },
				{ status: 403 }
			)
		}

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
				chapterId: user.chapterId,
				chapterName: user.chapter?.name,
				verificationStatus: user.verificationStatus,
			},
		})
	} catch (error) {
		console.error('Sign-in error:', error)
		return NextResponse.json(
			{ error: 'An error occurred during sign-in' },
			{ status: 500 }
		)
	}
}

