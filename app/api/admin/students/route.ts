import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession, isChapterAdmin } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export async function GET() {
	try {
		const session = await getSession()

		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const isAdmin = await isChapterAdmin()
		if (!isAdmin) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		// WTSA admin sees all students, chapter admin sees only their chapter
		const where = session.role === UserRole.ADMIN
			? { role: UserRole.STUDENT }
			: { role: UserRole.STUDENT, chapterId: session.chapterId }

		const students = await prisma.user.findMany({
			where,
			include: {
				chapter: { select: { id: true, name: true } },
				verifiedBy: { select: { id: true, name: true } },
			},
			orderBy: [
				{ verificationStatus: 'asc' }, // Pending first
				{ createdAt: 'desc' },
			],
		})

		return NextResponse.json({ students })
	} catch (error) {
		console.error('Get students error:', error)
		return NextResponse.json(
			{ error: 'An error occurred' },
			{ status: 500 }
		)
	}
}

