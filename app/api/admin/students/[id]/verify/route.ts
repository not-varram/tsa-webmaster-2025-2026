import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession, isChapterAdmin } from '@/lib/auth'
import { UserRole, VerificationStatus } from '@prisma/client'
import { z } from 'zod'

const verifySchema = z.object({
	approve: z.boolean(),
})

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

		// Get the student to verify
		const student = await prisma.user.findUnique({
			where: { id: studentId },
		})

		if (!student) {
			return NextResponse.json({ error: 'Student not found' }, { status: 404 })
		}

		// Check permissions - must be admin of the student's chapter
		const canManage = session.role === UserRole.ADMIN ||
			(session.role === UserRole.CHAPTER_ADMIN && session.chapterId === student.chapterId)

		if (!canManage) {
			return NextResponse.json(
				{ error: 'You can only manage students in your chapter' },
				{ status: 403 }
			)
		}

		const body = await request.json()
		const validation = verifySchema.safeParse(body)

		if (!validation.success) {
			return NextResponse.json(
				{ error: validation.error.errors[0].message },
				{ status: 400 }
			)
		}

		const { approve } = validation.data

		// Update student verification status
		const updatedStudent = await prisma.user.update({
			where: { id: studentId },
			data: {
				verificationStatus: approve
					? VerificationStatus.APPROVED
					: VerificationStatus.REJECTED,
				verifiedById: session.id,
				verifiedAt: new Date(),
			},
		})

		return NextResponse.json({
			success: true,
			student: {
				id: updatedStudent.id,
				name: updatedStudent.name,
				verificationStatus: updatedStudent.verificationStatus,
			},
		})
	} catch (error) {
		console.error('Verify student error:', error)
		return NextResponse.json(
			{ error: 'An error occurred' },
			{ status: 500 }
		)
	}
}

