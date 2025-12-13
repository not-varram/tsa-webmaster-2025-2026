import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// Public route to get chapters for sign-up dropdown
export async function GET() {
	try {
		const chapters = await prisma.chapter.findMany({
			select: {
				id: true,
				name: true,
				schoolName: true,
			},
			orderBy: { name: 'asc' },
		})

		return NextResponse.json({ chapters })
	} catch (error) {
		console.error('Get chapters error:', error)
		return NextResponse.json(
			{ error: 'An error occurred' },
			{ status: 500 }
		)
	}
}

