import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession, isChapterAdmin, isWTSAAdmin } from '@/lib/auth'
import { PostStatus, UserRole } from '@prisma/client'

/**
 * GET /api/posts/[id] - Get a single post with comments
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const session = await getSession()
		
		const post = await prisma.resourcePost.findUnique({
			where: { id },
			include: {
				author: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				chapter: {
					select: {
						id: true,
						name: true,
						slug: true,
					},
				},
				reviewedBy: {
					select: {
						id: true,
						name: true,
					},
				},
				filledBy: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				comments: {
					include: {
						author: {
							select: {
								id: true,
								name: true,
							},
						},
					},
					orderBy: { createdAt: 'asc' },
				},
			},
		})
		
		if (!post) {
			return NextResponse.json(
				{ error: 'Post not found' },
				{ status: 404 }
			)
		}
		
		// Check access permissions
		const isAuthor = session?.id === post.authorId
		const isAdmin = session?.role === UserRole.ADMIN
		const isChapAdmin = session?.role === UserRole.CHAPTER_ADMIN &&
			session?.chapterId === post.chapterId
		
		// Non-approved posts can only be seen by author, chapter admin, or WTSA admin
		if (post.status !== PostStatus.APPROVED && !isAuthor && !isAdmin && !isChapAdmin) {
			return NextResponse.json(
				{ error: 'Post not found' },
				{ status: 404 }
			)
		}
		
		return NextResponse.json({ post })
	} catch (error) {
		console.error('Error fetching post:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch post' },
			{ status: 500 }
		)
	}
}

/**
 * PATCH /api/posts/[id] - Update post (approve, reject, fill, close)
 */
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const session = await getSession()
		
		if (!session) {
			return NextResponse.json(
				{ error: 'You must be signed in' },
				{ status: 401 }
			)
		}
		
		const post = await prisma.resourcePost.findUnique({
			where: { id },
		})
		
		if (!post) {
			return NextResponse.json(
				{ error: 'Post not found' },
				{ status: 404 }
			)
		}
		
		const body = await request.json()
		const { action, rejectionReason, contactName, contactEmail, contactPhone, contactNotes } = body
		
		const isAuthor = session.id === post.authorId
		const isAdmin = await isWTSAAdmin()
		const isChapAdmin = await isChapterAdmin(post.chapterId || undefined)
		
		switch (action) {
			case 'approve': {
				if (!isAdmin && !isChapAdmin) {
					return NextResponse.json(
						{ error: 'Only admins can approve posts' },
						{ status: 403 }
					)
				}
				
				const updatedPost = await prisma.resourcePost.update({
					where: { id },
					data: {
						status: PostStatus.APPROVED,
						reviewedById: session.id,
						reviewedAt: new Date(),
					},
				})
				
				return NextResponse.json({
					post: updatedPost,
					message: 'Post approved and now visible',
				})
			}
			
			case 'reject': {
				if (!isAdmin && !isChapAdmin) {
					return NextResponse.json(
						{ error: 'Only admins can reject posts' },
						{ status: 403 }
					)
				}
				
				if (!rejectionReason) {
					return NextResponse.json(
						{ error: 'Rejection reason is required' },
						{ status: 400 }
					)
				}
				
				const updatedPost = await prisma.resourcePost.update({
					where: { id },
					data: {
						status: PostStatus.REJECTED,
						reviewedById: session.id,
						reviewedAt: new Date(),
						rejectionReason,
					},
				})
				
				return NextResponse.json({
					post: updatedPost,
					message: 'Post rejected',
				})
			}
			
			case 'fill': {
				// Anyone can offer to fill a request (with contact details)
				if (post.status !== PostStatus.APPROVED) {
					return NextResponse.json(
						{ error: 'Can only fill approved posts' },
						{ status: 400 }
					)
				}
				
				if (!contactName || !contactEmail) {
					return NextResponse.json(
						{ error: 'Contact name and email are required' },
						{ status: 400 }
					)
				}
				
				const updatedPost = await prisma.resourcePost.update({
					where: { id },
					data: {
						status: PostStatus.FILLED,
						filledById: session.id,
						filledAt: new Date(),
						contactName,
						contactEmail,
						contactPhone,
						contactNotes,
					},
				})
				
				return NextResponse.json({
					post: updatedPost,
					message: 'Thank you! The requester will be notified.',
				})
			}
			
			case 'close': {
				if (!isAuthor && !isAdmin) {
					return NextResponse.json(
						{ error: 'Only the author or admins can close a post' },
						{ status: 403 }
					)
				}
				
				const updatedPost = await prisma.resourcePost.update({
					where: { id },
					data: {
						status: PostStatus.CLOSED,
					},
				})
				
				return NextResponse.json({
					post: updatedPost,
					message: 'Post closed',
				})
			}
			
			default:
				return NextResponse.json(
					{ error: 'Invalid action' },
					{ status: 400 }
				)
		}
	} catch (error) {
		console.error('Error updating post:', error)
		return NextResponse.json(
			{ error: 'Failed to update post' },
			{ status: 500 }
		)
	}
}

/**
 * DELETE /api/posts/[id] - Delete a post (author or admin only)
 */
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params
		const session = await getSession()
		
		if (!session) {
			return NextResponse.json(
				{ error: 'You must be signed in' },
				{ status: 401 }
			)
		}
		
		const post = await prisma.resourcePost.findUnique({
			where: { id },
		})
		
		if (!post) {
			return NextResponse.json(
				{ error: 'Post not found' },
				{ status: 404 }
			)
		}
		
		const isAuthor = session.id === post.authorId
		const isAdmin = await isWTSAAdmin()
		
		if (!isAuthor && !isAdmin) {
			return NextResponse.json(
				{ error: 'You can only delete your own posts' },
				{ status: 403 }
			)
		}
		
		await prisma.resourcePost.delete({
			where: { id },
		})
		
		return NextResponse.json({ message: 'Post deleted' })
	} catch (error) {
		console.error('Error deleting post:', error)
		return NextResponse.json(
			{ error: 'Failed to delete post' },
			{ status: 500 }
		)
	}
}

