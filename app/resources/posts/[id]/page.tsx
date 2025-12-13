import { notFound } from 'next/navigation'
import prisma from '@/lib/db'
import { getSession, isVerifiedUser } from '@/lib/auth'
import { PostDetailClient } from './PostDetailClient'
import { Metadata } from 'next'

type Props = {
	params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params
	const post = await prisma.resourcePost.findUnique({
		where: { id },
		select: { title: true, description: true },
	})
	
	if (!post) {
		return { title: 'Post Not Found' }
	}
	
	return {
		title: `${post.title} - WTSA Community`,
		description: post.description.slice(0, 160),
	}
}

export default async function PostDetailPage({ params }: Props) {
	const { id } = await params
	const session = await getSession()
	const isVerified = await isVerifiedUser()
	
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
		notFound()
	}
	
	// Check permissions
	const isAuthor = session?.id === post.authorId
	const isAdmin = session?.role === 'ADMIN'
	const isChapAdmin = session?.role === 'CHAPTER_ADMIN' && session?.chapterId === post.chapterId
	
	// Non-approved posts can only be seen by author, chapter admin, or WTSA admin
	if (post.status !== 'APPROVED' && post.status !== 'FILLED' && !isAuthor && !isAdmin && !isChapAdmin) {
		notFound()
	}
	
	// Serialize dates
	const serializedPost = {
		...post,
		createdAt: post.createdAt.toISOString(),
		updatedAt: post.updatedAt.toISOString(),
		reviewedAt: post.reviewedAt?.toISOString() || null,
		filledAt: post.filledAt?.toISOString() || null,
		comments: post.comments.map((c) => ({
			...c,
			createdAt: c.createdAt.toISOString(),
			updatedAt: c.updatedAt.toISOString(),
		})),
	}
	
	return (
		<PostDetailClient
			post={serializedPost}
			currentUserId={session?.id || null}
			isSignedIn={!!session}
			isVerified={isVerified}
			isAuthor={isAuthor}
			isAdmin={isAdmin || isChapAdmin}
		/>
	)
}

