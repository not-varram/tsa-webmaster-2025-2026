import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession, createToken, setAuthCookie } from '@/lib/auth'
import { z } from 'zod'

const updateProfileSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
})

export async function PATCH(request: NextRequest) {
	try {
		const session = await getSession()
		
		if (!session) {
			return NextResponse.json(
				{ error: 'You must be signed in' },
				{ status: 401 }
			)
		}
		
		const body = await request.json()
		const validation = updateProfileSchema.safeParse(body)
		
		if (!validation.success) {
			return NextResponse.json(
				{ error: validation.error.errors[0].message },
				{ status: 400 }
			)
		}
		
		const { name } = validation.data
		
		// Update user
		const user = await prisma.user.update({
			where: { id: session.id },
			data: { name: name.trim() },
			include: { chapter: true },
		})
		
		// Update session token with new name
		const token = await createToken({
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
			chapterId: user.chapterId,
			verificationStatus: user.verificationStatus,
			tokenVersion: user.tokenVersion,
		})
		
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
		console.error('Update profile error:', error)
		return NextResponse.json(
			{ error: 'Failed to update profile' },
			{ status: 500 }
		)
	}
}

