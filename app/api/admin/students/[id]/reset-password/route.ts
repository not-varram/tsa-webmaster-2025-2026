import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession, hashPassword } from '@/lib/auth'
import { UserRole } from '@prisma/client'

/**
 * Generate a secure temporary password
 */
function generateTempPassword(): string {
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%'
	let password = ''
	for (let i = 0; i < 12; i++) {
		password += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return password
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: studentId } = await params
		const session = await getSession()

		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Only chapter admins can reset passwords (not WTSA admin for security)
		if (session.role !== UserRole.CHAPTER_ADMIN) {
			return NextResponse.json(
				{ error: 'Only chapter admins can reset student passwords' },
				{ status: 403 }
			)
		}

		// Get the student
		const student = await prisma.user.findUnique({
			where: { id: studentId },
		})

		if (!student) {
			return NextResponse.json({ error: 'Student not found' }, { status: 404 })
		}

		// Check that the student is in the admin's chapter
		if (student.chapterId !== session.chapterId) {
			return NextResponse.json(
				{ error: 'You can only reset passwords for students in your chapter' },
				{ status: 403 }
			)
		}

		// Ensure we're only resetting passwords for students, not other admins
		if (student.role !== UserRole.STUDENT) {
			return NextResponse.json(
				{ error: 'Can only reset passwords for students' },
				{ status: 400 }
			)
		}

		// Generate new temporary password
		const tempPassword = generateTempPassword()
		const hashedPassword = await hashPassword(tempPassword)

		// Update password
		await prisma.user.update({
			where: { id: studentId },
			data: { password: hashedPassword },
		})

		// Return the temporary password (admin will share this with the student)
		return NextResponse.json({
			success: true,
			tempPassword,
			message: 'Password reset successfully. Share this temporary password with the student securely.',
		})
	} catch (error) {
		console.error('Reset password error:', error)
		return NextResponse.json(
			{ error: 'An error occurred' },
			{ status: 500 }
		)
	}
}

