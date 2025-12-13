import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession, isVerifiedUser } from '@/lib/auth'
import { PostStatus } from '@prisma/client'

/**
 * POST /api/posts/[id]/comments - Add a comment to a post
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const session = await getSession()
		
		if (!session) {
			return NextResponse.json(
				{ error: 'You must be signed in to comment' },
				{ status: 401 }
			)
		}
		
		const isVerified = await isVerifiedUser()
		if (!isVerified) {
			return NextResponse.json(
				{ error: 'Your account must be verified to comment' },
				{ status: 403 }
			)
		}
		
		// Check if post exists and is approved
		const post = await prisma.resourcePost.findUnique({
			where: { id },
		})
		
		if (!post) {
			return NextResponse.json(
				{ error: 'Post not found' },
				{ status: 404 }
			)
		}
		
		if (post.status !== PostStatus.APPROVED && post.status !== PostStatus.FILLED) {
			return NextResponse.json(
				{ error: 'Cannot comment on this post' },
				{ status: 400 }
			)
		}
		
		const body = await request.json()
		const { content } = body
		
		if (!content || content.trim().length < 1) {
			return NextResponse.json(
				{ error: 'Comment cannot be empty' },
				{ status: 400 }
			)
		}
		
		if (content.length > 2000) {
			return NextResponse.json(
				{ error: 'Comment is too long (max 2000 characters)' },
				{ status: 400 }
			)
		}
		
		const comment = await prisma.postComment.create({
			data: {
				postId: id,
				authorId: session.id,
				content: content.trim(),
			},
			include: {
				author: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		})
		
		return NextResponse.json({ comment })
	} catch (error) {
		console.error('Error creating comment:', error)
		return NextResponse.json(
			{ error: 'Failed to create comment' },
			{ status: 500 }
		)
	}
}

