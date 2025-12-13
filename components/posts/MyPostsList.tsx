'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { 
	Search, Package, MessageSquare, Clock, CheckCircle, 
	XCircle, AlertCircle, Loader2, ExternalLink 
} from 'lucide-react'

type Post = {
	id: string
	title: string
	type: 'REQUEST' | 'OFFERING'
	category: string
	status: string
	rejectionReason?: string | null
	_count?: {
		comments: number
	}
	createdAt: string
}

export function MyPostsList() {
	const [posts, setPosts] = useState<Post[]>([])
	const [isLoading, setIsLoading] = useState(true)
	
	useEffect(() => {
		async function fetchPosts() {
			try {
				const res = await fetch('/api/posts?my=true')
				const data = await res.json()
				setPosts(data.posts || [])
			} catch (error) {
				console.error('Failed to fetch posts:', error)
			} finally {
				setIsLoading(false)
			}
		}
		fetchPosts()
	}, [])
	
	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
			</div>
		)
	}
	
	if (posts.length === 0) {
		return (
			<div className="text-center py-8 text-neutral-500">
				<Package className="w-10 h-10 mx-auto mb-2 text-neutral-300" />
				<p>You haven&apos;t created any posts yet.</p>
				<Link 
					href="/resources" 
					className="text-primary-600 hover:underline text-sm mt-2 inline-block"
				>
					Go to Resource Hub to create one
				</Link>
			</div>
		)
	}
	
	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'PENDING':
				return (
					<span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
						<AlertCircle className="w-3 h-3" />
						Pending Review
					</span>
				)
			case 'APPROVED':
				return (
					<span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
						<CheckCircle className="w-3 h-3" />
						Approved
					</span>
				)
			case 'REJECTED':
				return (
					<span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium">
						<XCircle className="w-3 h-3" />
						Rejected
					</span>
				)
			case 'FILLED':
				return (
					<span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
						<CheckCircle className="w-3 h-3" />
						Fulfilled
					</span>
				)
			case 'CLOSED':
				return (
					<span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-full text-xs font-medium">
						Closed
					</span>
				)
			default:
				return null
		}
	}
	
	return (
		<div className="divide-y divide-neutral-200">
			{posts.map((post) => {
				const isRequest = post.type === 'REQUEST'
				
				return (
					<Link
						key={post.id}
						href={`/resources/posts/${post.id}`}
						className="block p-4 hover:bg-neutral-50 transition-colors"
					>
						<div className="flex items-start justify-between gap-4">
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-1">
									<span
										className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
											isRequest
												? 'bg-amber-50 text-amber-700'
												: 'bg-emerald-50 text-emerald-700'
										}`}
									>
										{isRequest ? <Search className="w-3 h-3" /> : <Package className="w-3 h-3" />}
										{isRequest ? 'Request' : 'Offering'}
									</span>
									{getStatusBadge(post.status)}
								</div>
								
								<h3 className="font-medium text-neutral-900 truncate">
									{post.title}
								</h3>
								
								<div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
									<span className="flex items-center gap-1">
										<Clock className="w-3 h-3" />
										{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
									</span>
									{post._count && (
										<span className="flex items-center gap-1">
											<MessageSquare className="w-3 h-3" />
											{post._count.comments} comment{post._count.comments !== 1 ? 's' : ''}
										</span>
									)}
								</div>
								
								{post.status === 'REJECTED' && post.rejectionReason && (
									<div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
										Reason: {post.rejectionReason}
									</div>
								)}
							</div>
							
							<ExternalLink className="w-4 h-4 text-neutral-400 shrink-0" />
						</div>
					</Link>
				)
			})}
		</div>
	)
}

