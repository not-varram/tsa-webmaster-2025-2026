'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow, format } from 'date-fns'
import {
	ArrowLeft, Search, Package, User, MapPin, Clock, MessageSquare,
	Send, Loader2, CheckCircle, XCircle, AlertCircle, Trash2, Mail, Phone
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

type Comment = {
	id: string
	content: string
	isFulfillment: boolean
	author: {
		id: string
		name: string
	}
	createdAt: string
}

type Post = {
	id: string
	title: string
	description: string
	type: 'REQUEST' | 'OFFERING'
	category: string
	tags: string[]
	status: string
	contactName?: string | null
	contactEmail?: string | null
	contactPhone?: string | null
	contactNotes?: string | null
	rejectionReason?: string | null
	author: {
		id: string
		name: string
		email: string
	}
	chapter?: {
		id: string
		name: string
		slug: string
	} | null
	reviewedBy?: {
		id: string
		name: string
	} | null
	filledBy?: {
		id: string
		name: string
		email: string
	} | null
	comments: Comment[]
	createdAt: string
	reviewedAt?: string | null
	filledAt?: string | null
}

type PostDetailClientProps = {
	post: Post
	currentUserId: string | null
	isSignedIn: boolean
	isVerified: boolean
	isAuthor: boolean
	isAdmin: boolean
}

export function PostDetailClient({
	post,
	currentUserId,
	isSignedIn,
	isVerified,
	isAuthor,
	isAdmin,
}: PostDetailClientProps) {
	const router = useRouter()
	const [comments, setComments] = useState<Comment[]>(post.comments)
	const [newComment, setNewComment] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState('')
	
	// Fill form state
	const [showFillForm, setShowFillForm] = useState(false)
	const [fillForm, setFillForm] = useState({
		contactName: '',
		contactEmail: '',
		contactPhone: '',
		contactNotes: '',
	})
	
	// Admin action states
	const [showRejectForm, setShowRejectForm] = useState(false)
	const [rejectionReason, setRejectionReason] = useState('')
	const [isProcessing, setIsProcessing] = useState(false)
	
	const isRequest = post.type === 'REQUEST'
	const isPending = post.status === 'PENDING'
	const isApproved = post.status === 'APPROVED'
	const isRejected = post.status === 'REJECTED'
	const isFilled = post.status === 'FILLED'
	const isClosed = post.status === 'CLOSED'
	
	async function handleSubmitComment(e: React.FormEvent) {
		e.preventDefault()
		if (!newComment.trim()) return
		
		setIsSubmitting(true)
		setError('')
		
		try {
			const res = await fetch(`/api/posts/${post.id}/comments`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content: newComment }),
			})
			
			const data = await res.json()
			
			if (!res.ok) {
				throw new Error(data.error || 'Failed to add comment')
			}
			
			setComments((prev) => [...prev, data.comment])
			setNewComment('')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong')
		} finally {
			setIsSubmitting(false)
		}
	}
	
	async function handleFillRequest(e: React.FormEvent) {
		e.preventDefault()
		setIsProcessing(true)
		setError('')
		
		try {
			const res = await fetch(`/api/posts/${post.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'fill',
					...fillForm,
				}),
			})
			
			const data = await res.json()
			
			if (!res.ok) {
				throw new Error(data.error || 'Failed to submit')
			}
			
			router.refresh()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong')
		} finally {
			setIsProcessing(false)
		}
	}
	
	async function handleAdminAction(action: 'approve' | 'reject' | 'close') {
		setIsProcessing(true)
		setError('')
		
		try {
			const body: Record<string, string> = { action }
			if (action === 'reject') {
				body.rejectionReason = rejectionReason
			}
			
			const res = await fetch(`/api/posts/${post.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			})
			
			const data = await res.json()
			
			if (!res.ok) {
				throw new Error(data.error || 'Failed to process')
			}
			
			router.refresh()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong')
		} finally {
			setIsProcessing(false)
		}
	}
	
	async function handleDelete() {
		if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
			return
		}
		
		setIsProcessing(true)
		
		try {
			const res = await fetch(`/api/posts/${post.id}`, {
				method: 'DELETE',
			})
			
			if (!res.ok) {
				const data = await res.json()
				throw new Error(data.error || 'Failed to delete')
			}
			
			router.push('/resources')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong')
			setIsProcessing(false)
		}
	}
	
	return (
		<div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
			{/* Back navigation */}
			<div className="bg-white border-b border-neutral-200">
				<div className="container py-4">
					<Link
						href="/resources"
						className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Resources
					</Link>
				</div>
			</div>
			
			<div className="container py-8">
				<div className="max-w-4xl mx-auto">
					{/* Error display */}
					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
							{error}
						</div>
					)}
					
					{/* Status banners */}
					{isPending && isAuthor && (
						<div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
							<AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
							<div>
								<div className="font-semibold text-amber-800">Pending Review</div>
								<div className="text-sm text-amber-700">
									Your post is awaiting approval from an admin. You&apos;ll be notified once it&apos;s reviewed.
								</div>
							</div>
						</div>
					)}
					
					{isRejected && isAuthor && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
							<div className="flex items-center gap-3 mb-2">
								<XCircle className="w-5 h-5 text-red-600" />
								<div className="font-semibold text-red-800">Post Rejected</div>
							</div>
							<div className="text-sm text-red-700">
								<strong>Reason:</strong> {post.rejectionReason}
							</div>
						</div>
					)}
					
					{isFilled && (
						<div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
							<CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
							<div>
								<div className="font-semibold text-green-800">
									{isRequest ? 'Request Fulfilled!' : 'Offering Claimed!'}
								</div>
								<div className="text-sm text-green-700">
									Filled by {post.filledBy?.name} on{' '}
									{post.filledAt && format(new Date(post.filledAt), 'MMM d, yyyy')}
								</div>
							</div>
						</div>
					)}
					
					{/* Main content card */}
					<article className="bg-white rounded-2xl shadow-lg overflow-hidden">
						{/* Header */}
						<div className={`p-6 ${isRequest ? 'bg-amber-50' : 'bg-emerald-50'}`}>
							<div className="flex items-start justify-between gap-4 mb-4">
								<span
									className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
										isRequest
											? 'bg-amber-200 text-amber-900'
											: 'bg-emerald-200 text-emerald-900'
									}`}
								>
									{isRequest ? <Search className="w-4 h-4" /> : <Package className="w-4 h-4" />}
									{isRequest ? 'Resource Request' : 'Resource Offering'}
								</span>
								
								<div className="flex items-center gap-2">
									{isFilled && (
										<span className="px-3 py-1 bg-green-200 text-green-900 rounded-full text-sm font-medium">
											✓ Fulfilled
										</span>
									)}
									{isClosed && (
										<span className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded-full text-sm font-medium">
											Closed
										</span>
									)}
								</div>
							</div>
							
							<h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
								{post.title}
							</h1>
							
							<div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
								<span className="flex items-center gap-1.5">
									<User className="w-4 h-4" />
									{post.author.name}
								</span>
								{post.chapter && (
									<Link
										href={`/chapters/${post.chapter.slug}`}
										className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
									>
										<MapPin className="w-4 h-4" />
										{post.chapter.name}
									</Link>
								)}
								<span className="flex items-center gap-1.5">
									<Clock className="w-4 h-4" />
									{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
								</span>
							</div>
						</div>
						
						{/* Body */}
						<div className="p-6">
							{/* Category and tags */}
							<div className="flex flex-wrap gap-2 mb-6">
								<span className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium">
									{post.category}
								</span>
								{post.tags.map((tag) => (
									<span
										key={tag}
										className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
									>
										{tag}
									</span>
								))}
							</div>
							
							{/* Description */}
							<div className="prose prose-neutral max-w-none mb-8">
								<p className="whitespace-pre-wrap">{post.description}</p>
							</div>
							
							{/* Filled by contact info (visible to author and admins) */}
							{isFilled && (isAuthor || isAdmin) && post.contactName && (
								<div className="p-5 bg-green-50 border border-green-200 rounded-xl mb-8">
									<h3 className="font-semibold text-green-900 mb-3">
										Contact Information
										{isAdmin && !isAuthor && (
											<span className="ml-2 text-xs font-normal text-green-700">(Admin view)</span>
										)}
									</h3>
									<div className="space-y-2 text-sm text-green-800">
										<div className="flex items-center gap-2">
											<User className="w-4 h-4" />
											<span>{post.contactName}</span>
										</div>
										<div className="flex items-center gap-2">
											<Mail className="w-4 h-4" />
											<a href={`mailto:${post.contactEmail}`} className="underline">
												{post.contactEmail}
											</a>
										</div>
										{post.contactPhone && (
											<div className="flex items-center gap-2">
												<Phone className="w-4 h-4" />
												<span>{post.contactPhone}</span>
											</div>
										)}
										{post.contactNotes && (
											<div className="mt-3 pt-3 border-t border-green-200">
												<strong>Notes:</strong> {post.contactNotes}
											</div>
										)}
									</div>
								</div>
							)}
							
							{/* Fill request form */}
							{isApproved && isSignedIn && isVerified && !isAuthor && isRequest && (
								<div className="mb-8">
									{showFillForm ? (
										<form onSubmit={handleFillRequest} className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
											<h3 className="font-semibold text-emerald-900 mb-4">
												Offer to Fill This Request
											</h3>
											<div className="space-y-4">
												<div>
													<label className="block text-sm font-medium text-neutral-700 mb-1">
														Your Name *
													</label>
													<input
														type="text"
														required
														value={fillForm.contactName}
														onChange={(e) => setFillForm((f) => ({ ...f, contactName: e.target.value }))}
														className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-neutral-700 mb-1">
														Email *
													</label>
													<input
														type="email"
														required
														value={fillForm.contactEmail}
														onChange={(e) => setFillForm((f) => ({ ...f, contactEmail: e.target.value }))}
														className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-neutral-700 mb-1">
														Phone (optional)
													</label>
													<input
														type="tel"
														value={fillForm.contactPhone}
														onChange={(e) => setFillForm((f) => ({ ...f, contactPhone: e.target.value }))}
														className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-neutral-700 mb-1">
														Additional Notes
													</label>
													<textarea
														rows={3}
														placeholder="Any details about what you're offering, availability, etc."
														value={fillForm.contactNotes}
														onChange={(e) => setFillForm((f) => ({ ...f, contactNotes: e.target.value }))}
														className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
													/>
												</div>
												<div className="flex gap-3">
													<Button type="submit" disabled={isProcessing}>
														{isProcessing ? (
															<>
																<Loader2 className="w-4 h-4 mr-2 animate-spin" />
																Submitting...
															</>
														) : (
															'Submit Offer'
														)}
													</Button>
													<Button
														type="button"
														variant="ghost"
														onClick={() => setShowFillForm(false)}
													>
														Cancel
													</Button>
												</div>
											</div>
										</form>
									) : (
										<Button
											onClick={() => setShowFillForm(true)}
											className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
										>
											<CheckCircle className="w-4 h-4 mr-2" />
											I Can Help With This Request
										</Button>
									)}
								</div>
							)}
							
							{/* Admin actions */}
							{isAdmin && isPending && (
								<div className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-xl">
									<h3 className="font-semibold text-blue-900 mb-4">Admin Actions</h3>
									
									{showRejectForm ? (
										<div className="space-y-4">
											<div>
												<label className="block text-sm font-medium text-neutral-700 mb-1">
													Rejection Reason *
												</label>
												<textarea
													required
													rows={3}
													placeholder="Explain why this post is being rejected..."
													value={rejectionReason}
													onChange={(e) => setRejectionReason(e.target.value)}
													className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
												/>
											</div>
											<div className="flex gap-3">
												<Button
													variant="secondary"
													onClick={() => handleAdminAction('reject')}
													disabled={isProcessing || !rejectionReason}
													className="bg-red-600 hover:bg-red-700"
												>
													{isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
													Confirm Rejection
												</Button>
												<Button variant="ghost" onClick={() => setShowRejectForm(false)}>
													Cancel
												</Button>
											</div>
										</div>
									) : (
										<div className="flex flex-wrap gap-3">
											<Button onClick={() => handleAdminAction('approve')} disabled={isProcessing}>
												{isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
												<CheckCircle className="w-4 h-4 mr-2" />
												Approve Post
											</Button>
											<Button
												variant="outline"
												onClick={() => setShowRejectForm(true)}
												className="border-red-300 text-red-600 hover:bg-red-50"
											>
												<XCircle className="w-4 h-4 mr-2" />
												Reject Post
											</Button>
										</div>
									)}
								</div>
							)}
							
							{/* Author actions */}
							{isAuthor && (isApproved || isFilled) && (
								<div className="mb-8 flex flex-wrap gap-3">
									{isApproved && (
										<Button
											variant="outline"
											onClick={() => handleAdminAction('close')}
											disabled={isProcessing}
										>
											Close Post
										</Button>
									)}
									<Button
										variant="ghost"
										onClick={handleDelete}
										disabled={isProcessing}
										className="text-red-600 hover:bg-red-50"
									>
										<Trash2 className="w-4 h-4 mr-2" />
										Delete Post
									</Button>
								</div>
							)}
						</div>
						
						{/* Comments section */}
						{(isApproved || isFilled) && (
							<div className="border-t border-neutral-200 p-6">
								<h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900 mb-6">
									<MessageSquare className="w-5 h-5" />
									Discussion ({comments.length})
								</h2>
								
								{/* Comments list */}
								{comments.length > 0 ? (
									<div className="space-y-4 mb-6">
										{comments.map((comment) => (
											<div
												key={comment.id}
												className={`p-4 rounded-xl ${
													comment.author.id === post.author.id
														? 'bg-primary-50 border border-primary-100'
														: 'bg-neutral-50'
												}`}
											>
												<div className="flex items-center justify-between mb-2">
													<div className="flex items-center gap-2">
														<span className="font-medium text-neutral-900">
															{comment.author.name}
														</span>
														{comment.author.id === post.author.id && (
															<span className="px-2 py-0.5 bg-primary-200 text-primary-800 rounded text-xs">
																Author
															</span>
														)}
													</div>
													<span className="text-xs text-neutral-500">
														{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
													</span>
												</div>
												<p className="text-neutral-700 whitespace-pre-wrap">{comment.content}</p>
											</div>
										))}
									</div>
								) : (
									<p className="text-neutral-500 text-center py-8 mb-6">
										No comments yet. Start the conversation!
									</p>
								)}
								
								{/* Comment form */}
								{isSignedIn && isVerified ? (
									<form onSubmit={handleSubmitComment}>
										<div className="flex gap-3">
											<input
												type="text"
												placeholder="Write a comment..."
												value={newComment}
												onChange={(e) => setNewComment(e.target.value)}
												className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
											/>
											<Button type="submit" disabled={isSubmitting || !newComment.trim()}>
												{isSubmitting ? (
													<Loader2 className="w-4 h-4 animate-spin" />
												) : (
													<Send className="w-4 h-4" />
												)}
											</Button>
										</div>
									</form>
								) : isSignedIn ? (
									<p className="text-center text-neutral-500 py-4 bg-neutral-50 rounded-xl">
										Your account must be verified to comment.
									</p>
								) : (
									<p className="text-center text-neutral-500 py-4 bg-neutral-50 rounded-xl">
										<a href="/sign-in" className="text-primary-600 hover:underline">Sign in</a> to join the discussion.
									</p>
								)}
							</div>
						)}
					</article>
				</div>
			</div>
		</div>
	)
}

