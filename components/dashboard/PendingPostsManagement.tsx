'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { 
	Search, Package, User, CheckCircle, XCircle, Loader2, 
	ExternalLink, ChevronDown, ChevronUp 
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

type PendingPost = {
	id: string
	title: string
	description: string
	type: 'REQUEST' | 'OFFERING'
	category: string
	tags: string[]
	author: {
		id: string
		name: string
		email: string
	}
	createdAt: string
}

type PendingPostsManagementProps = {
	posts: PendingPost[]
}

export function PendingPostsManagement({ posts: initialPosts }: PendingPostsManagementProps) {
	const [posts, setPosts] = useState(initialPosts)
	const [expandedPost, setExpandedPost] = useState<string | null>(null)
	const [processingId, setProcessingId] = useState<string | null>(null)
	const [showRejectForm, setShowRejectForm] = useState<string | null>(null)
	const [rejectionReason, setRejectionReason] = useState('')
	const [error, setError] = useState('')
	
	async function handleApprove(postId: string) {
		setProcessingId(postId)
		setError('')
		
		try {
			const res = await fetch(`/api/posts/${postId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'approve' }),
			})
			
			if (!res.ok) {
				const data = await res.json()
				throw new Error(data.error || 'Failed to approve')
			}
			
			setPosts((prev) => prev.filter((p) => p.id !== postId))
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong')
		} finally {
			setProcessingId(null)
		}
	}
	
	async function handleReject(postId: string) {
		if (!rejectionReason.trim()) {
			setError('Please provide a rejection reason')
			return
		}
		
		setProcessingId(postId)
		setError('')
		
		try {
			const res = await fetch(`/api/posts/${postId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'reject', rejectionReason }),
			})
			
			if (!res.ok) {
				const data = await res.json()
				throw new Error(data.error || 'Failed to reject')
			}
			
			setPosts((prev) => prev.filter((p) => p.id !== postId))
			setShowRejectForm(null)
			setRejectionReason('')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong')
		} finally {
			setProcessingId(null)
		}
	}
	
	if (posts.length === 0) {
		return (
			<div className="text-center py-12 text-gray-500">
				<CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-300" />
				<p>No pending posts to review</p>
			</div>
		)
	}
	
	return (
		<div className="divide-y divide-gray-200">
			{error && (
				<div className="p-4 bg-red-50 border-b border-red-200 text-red-700 text-sm">
					{error}
				</div>
			)}
			
			{posts.map((post) => {
				const isExpanded = expandedPost === post.id
				const isRequest = post.type === 'REQUEST'
				const isProcessing = processingId === post.id
				const showingReject = showRejectForm === post.id
				
				return (
					<div key={post.id} className="p-4">
						{/* Post header */}
						<div className="flex items-start gap-4">
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-1">
									<span
										className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
											isRequest
												? 'bg-amber-100 text-amber-800'
												: 'bg-emerald-100 text-emerald-800'
										}`}
									>
										{isRequest ? <Search className="w-3 h-3" /> : <Package className="w-3 h-3" />}
										{isRequest ? 'Request' : 'Offering'}
									</span>
									<span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
										{post.category}
									</span>
								</div>
								
								<h3 className="font-semibold text-gray-900 truncate">
									{post.title}
								</h3>
								
								<div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
									<span className="flex items-center gap-1">
										<User className="w-3.5 h-3.5" />
										{post.author.name}
									</span>
									<span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
								</div>
							</div>
							
							{/* Actions */}
							<div className="flex items-center gap-2 shrink-0">
								<Link
									href={`/resources/posts/${post.id}`}
									target="_blank"
									className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
									title="View full post"
								>
									<ExternalLink className="w-4 h-4 text-gray-500" />
								</Link>
								<button
									onClick={() => setExpandedPost(isExpanded ? null : post.id)}
									className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
								>
									{isExpanded ? (
										<ChevronUp className="w-4 h-4 text-gray-500" />
									) : (
										<ChevronDown className="w-4 h-4 text-gray-500" />
									)}
								</button>
							</div>
						</div>
						
						{/* Expanded content */}
						{isExpanded && (
							<div className="mt-4 pt-4 border-t border-gray-100">
								<p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">
									{post.description}
								</p>
								
								{post.tags.length > 0 && (
									<div className="flex flex-wrap gap-1 mb-4">
										{post.tags.map((tag) => (
											<span
												key={tag}
												className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs"
											>
												{tag}
											</span>
										))}
									</div>
								)}
								
								{/* Reject form */}
								{showingReject ? (
									<div className="space-y-3 p-4 bg-red-50 rounded-lg">
										<label className="block text-sm font-medium text-gray-700">
											Rejection Reason *
										</label>
										<textarea
											rows={2}
											placeholder="Explain why this post is being rejected..."
											value={rejectionReason}
											onChange={(e) => setRejectionReason(e.target.value)}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
										/>
										<div className="flex gap-2">
											<Button
												size="sm"
												onClick={() => handleReject(post.id)}
												disabled={isProcessing || !rejectionReason.trim()}
												className="bg-red-600 hover:bg-red-700"
											>
												{isProcessing ? (
													<Loader2 className="w-4 h-4 animate-spin" />
												) : (
													'Confirm Rejection'
												)}
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => {
													setShowRejectForm(null)
													setRejectionReason('')
												}}
											>
												Cancel
											</Button>
										</div>
									</div>
								) : (
									<div className="flex gap-2">
										<Button
											size="sm"
											onClick={() => handleApprove(post.id)}
											disabled={isProcessing}
										>
											{isProcessing ? (
												<Loader2 className="w-4 h-4 mr-1 animate-spin" />
											) : (
												<CheckCircle className="w-4 h-4 mr-1" />
											)}
											Approve
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={() => setShowRejectForm(post.id)}
											className="border-red-300 text-red-600 hover:bg-red-50"
										>
											<XCircle className="w-4 h-4 mr-1" />
											Reject
										</Button>
									</div>
								)}
							</div>
						)}
					</div>
				)
			})}
		</div>
	)
}

