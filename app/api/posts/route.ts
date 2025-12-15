import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'
import { PostStatus, PostType } from '@prisma/client'

const POST_CATEGORIES = [
	'Technical Materials',
	'Building Materials',
	'Equipment',
	'Competition Resources',
	'Software/Digital',
	'Other',
]

/**
 * GET /api/posts - List approved posts (public) or all posts for admins
 */
export async function GET(request: NextRequest) {
	try {
		const session = await getSession()
		const { searchParams } = new URL(request.url)
		
		const type = searchParams.get('type') as PostType | null
		const category = searchParams.get('category')
		const status = searchParams.get('status') as PostStatus | null
		const myPosts = searchParams.get('my') === 'true'
		const pending = searchParams.get('pending') === 'true'
		
		// Build where clause
		const where: Record<string, unknown> = {}
		
		// Filter by type
		if (type) where.type = type
		
		// Filter by category
		if (category) where.category = category
		
		// For "my posts" view
		if (myPosts && session) {
			where.authorId = session.id
		} else if (pending && session?.role === 'CHAPTER_ADMIN') {
			// Chapter admins see pending posts from their chapter
			where.status = PostStatus.PENDING
			where.chapterId = session.chapterId
		} else if (pending && session?.role === 'ADMIN') {
			// WTSA admins see all pending posts
			where.status = PostStatus.PENDING
		} else if (status) {
			// Filter by specific status
			where.status = status
		} else {
			// Public view - only approved posts
			where.status = PostStatus.APPROVED
		}
		
		const posts = await prisma.resourcePost.findMany({
			where,
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
				filledBy: {
					select: {
						id: true,
						name: true,
					},
				},
				_count: {
					select: {
						comments: true,
					},
				},
			},
			orderBy: { createdAt: 'desc' },
		})
		
		// Contact info visible to: original poster, chapter admins, WTSA admins
		const isAdmin = session?.role === 'ADMIN' || session?.role === 'CHAPTER_ADMIN'
		const postsWithContactInfo = (myPosts || isAdmin) ? posts : posts.map((post) => ({
			...post,
			contactName: null,
			contactEmail: null,
			contactPhone: null,
			contactNotes: null,
		}))
		
		return NextResponse.json({ posts: postsWithContactInfo })
	} catch (error) {
		console.error('Error fetching posts:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch posts' },
			{ status: 500 }
		)
	}
}

/**
 * POST /api/posts - Create a new resource post
 */
export async function POST(request: NextRequest) {
	try {
		const session = await getSession()
		
		if (!session) {
			return NextResponse.json(
				{ error: 'You must be signed in to create a post' },
				{ status: 401 }
			)
		}

			// Always check latest verification status from DB (avoid stale tokens)
			const dbUser = await prisma.user.findUnique({
				where: { id: session.id },
				select: { verificationStatus: true, role: true, chapterId: true },
			})

			if (!dbUser) {
				return NextResponse.json(
					{ error: 'User not found' },
					{ status: 401 }
				)
			}

			const isAdminRole = session.role === 'ADMIN' || session.role === 'CHAPTER_ADMIN'
			const isVerified = isAdminRole || dbUser.verificationStatus === 'APPROVED'

			if (!isVerified) {
				return NextResponse.json(
					{ error: 'Your account must be verified to create posts' },
					{ status: 403 }
				)
			}
		
		const body = await request.json()
		const { title, description, type, category, tags } = body
		
		// Validation
		if (!title || title.trim().length < 5) {
			return NextResponse.json(
				{ error: 'Title must be at least 5 characters' },
				{ status: 400 }
			)
		}
		
		if (!description || description.trim().length < 20) {
			return NextResponse.json(
				{ error: 'Description must be at least 20 characters' },
				{ status: 400 }
			)
		}
		
		if (!type || !Object.values(PostType).includes(type)) {
			return NextResponse.json(
				{ error: 'Invalid post type' },
				{ status: 400 }
			)
		}
		
		if (!category || !POST_CATEGORIES.includes(category)) {
			return NextResponse.json(
				{ error: 'Invalid category' },
				{ status: 400 }
			)
		}
		
		// Auto-approve posts from admins and chapter admins
		const isAdmin = session.role === 'ADMIN' || session.role === 'CHAPTER_ADMIN'
		
		// Create the post - auto-approve for admins, pending for regular users
		const post = await prisma.resourcePost.create({
			data: {
				title: title.trim(),
				description: description.trim(),
				type,
				category,
				tags: tags || [],
				authorId: session.id,
				chapterId: dbUser.chapterId,
				status: isAdmin ? PostStatus.APPROVED : PostStatus.PENDING,
				reviewedById: isAdmin ? session.id : undefined,
				reviewedAt: isAdmin ? new Date() : undefined,
			},
			include: {
				author: {
					select: {
						id: true,
						name: true,
					},
				},
				chapter: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		})
		
		return NextResponse.json({
			post,
			message: isAdmin 
				? 'Post created and published successfully!' 
				: 'Post created successfully. It will be visible once approved by an admin.',
		})
	} catch (error) {
		console.error('Error creating post:', error)
		return NextResponse.json(
			{ error: 'Failed to create post' },
			{ status: 500 }
		)
	}
}

