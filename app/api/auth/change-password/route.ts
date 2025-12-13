import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession, verifyPassword, hashPassword } from '@/lib/auth'
import { z } from 'zod'

const changePasswordSchema = z.object({
	currentPassword: z.string().min(1, 'Current password is required'),
	newPassword: z.string().min(8, 'New password must be at least 8 characters'),
})

export async function POST(request: NextRequest) {
	try {
		const session = await getSession()

		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await request.json()
		const validation = changePasswordSchema.safeParse(body)

		if (!validation.success) {
			return NextResponse.json(
				{ error: validation.error.errors[0].message },
				{ status: 400 }
			)
		}

		const { currentPassword, newPassword } = validation.data

		// Get user with password
		const user = await prisma.user.findUnique({
			where: { id: session.id },
		})

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		// Verify current password
		const isValidPassword = await verifyPassword(currentPassword, user.password)

		if (!isValidPassword) {
			return NextResponse.json(
				{ error: 'Current password is incorrect' },
				{ status: 400 }
			)
		}

		// Hash and update new password
		const hashedPassword = await hashPassword(newPassword)

		await prisma.user.update({
			where: { id: session.id },
			data: { password: hashedPassword },
		})

		return NextResponse.json({
			success: true,
			message: 'Password changed successfully',
		})
	} catch (error) {
		console.error('Change password error:', error)
		return NextResponse.json(
			{ error: 'An error occurred' },
			{ status: 500 }
		)
	}
}

