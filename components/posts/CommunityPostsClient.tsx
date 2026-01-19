'use client'

import { useState, useEffect, useCallback } from 'react'
import { PostCard } from './PostCard'
import { CreatePostModal } from './CreatePostModal'
import { Plus, Search, Package, RefreshCw, Filter, CheckCircle, History } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const POST_CATEGORIES = [
	'Technical Materials',
	'Building Materials',
	'Equipment',
	'Competition Resources',
	'Software/Digital',
	'Other',
]

type Post = {
	id: string
	title: string
	description: string
	type: 'REQUEST' | 'OFFERING'
	category: string
	tags: string[]
	status: string
	author: {
		id: string
		name: string
	}
	chapter?: {
		id: string
		name: string
		slug: string
	} | null
	filledBy?: {
		id: string
		name: string
	} | null
	_count?: {
		comments: number
	}
	createdAt: string
}

type CommunityPostsClientProps = {
	isSignedIn: boolean
	isVerified: boolean
	isAdmin?: boolean
}

export function CommunityPostsClient({ isSignedIn, isVerified, isAdmin = false }: CommunityPostsClientProps) {
	const [posts, setPosts] = useState<Post[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [typeFilter, setTypeFilter] = useState<'' | 'REQUEST' | 'OFFERING'>('')
	const [categoryFilter, setCategoryFilter] = useState('')
	const [statusFilter, setStatusFilter] = useState<'APPROVED' | 'FILLED'>('APPROVED')
	const [verified, setVerified] = useState(isVerified)

	const refreshVerification = useCallback(async () => {
		if (!isSignedIn) {
			setVerified(false)
			return
		}
		try {
			const res = await fetch('/api/auth/me', {
				cache: 'no-store',
				credentials: 'include',
				next: { revalidate: 0 },
			})
			const data = await res.json()
			setVerified(data.user?.verificationStatus === 'APPROVED')
		} catch (err) {
			console.error('Failed to refresh verification status', err)
		}
	}, [isSignedIn])
	
	const fetchPosts = useCallback(async () => {
		setIsLoading(true)
		try {
			const params = new URLSearchParams()
			if (typeFilter) params.set('type', typeFilter)
			if (categoryFilter) params.set('category', categoryFilter)
			params.set('status', statusFilter)
			
			const res = await fetch(`/api/posts?${params.toString()}`)
			const data = await res.json()
			setPosts(data.posts || [])
		} catch (error) {
			console.error('Failed to fetch posts:', error)
		} finally {
			setIsLoading(false)
		}
	}, [typeFilter, categoryFilter, statusFilter])
	
	useEffect(() => {
		fetchPosts()
		refreshVerification()
	}, [fetchPosts, refreshVerification])
	
	const requestCount = posts.filter((p) => p.type === 'REQUEST').length
	const offeringCount = posts.filter((p) => p.type === 'OFFERING').length
	
	return (
		<div className="space-y-6">
			{/* Header with create button */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold text-neutral-900">Community Board</h2>
					<p className="text-neutral-600 mt-1">
						Request resources you need or share what you have to offer
					</p>
				</div>
				
				<div className="flex items-center gap-3">
					{isSignedIn && (
						<Link href="/profile" className="text-sm text-primary-600 hover:underline">
							My Posts
						</Link>
					)}
				{isSignedIn && verified ? (
					<Button onClick={() => setIsModalOpen(true)} className="shrink-0">
						<Plus className="w-4 h-4 mr-2" />
						Create Post
					</Button>
				) : (
					<div className="disabled-tooltip inline-block" data-tooltip="You need to signup and be a part of the chapter to use this feature">
						<Button 
							disabled 
							className="shrink-0 cursor-not-allowed opacity-60"
						>
							<Plus className="w-4 h-4 mr-2" />
							Create Post
						</Button>
					</div>
				)}
				</div>
			</div>
			
			{/* Status tabs */}
			<div className="flex gap-2 border-b border-neutral-200 pb-4">
				<button
					onClick={() => setStatusFilter('APPROVED')}
					className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
						statusFilter === 'APPROVED'
							? 'bg-green-100 text-green-800 border border-green-200'
							: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
					}`}
				>
					<Search className="w-4 h-4" />
					Active Posts
				</button>
				<button
					onClick={() => setStatusFilter('FILLED')}
					className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
						statusFilter === 'FILLED'
							? 'bg-blue-100 text-blue-800 border border-blue-200'
							: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
					}`}
				>
					<CheckCircle className="w-4 h-4" />
					Fulfilled
					<History className="w-3 h-3" />
				</button>
			</div>
			
			{/* Stats cards - only for active posts */}
			{statusFilter === 'APPROVED' && (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="bg-white rounded-xl border border-neutral-200 p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-amber-100 rounded-lg">
								<Search className="w-5 h-5 text-amber-700" />
							</div>
							<div>
								<div className="text-2xl font-bold text-neutral-900">{requestCount}</div>
								<div className="text-xs text-neutral-500">Active Requests</div>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-xl border border-neutral-200 p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-emerald-100 rounded-lg">
								<Package className="w-5 h-5 text-emerald-700" />
							</div>
							<div>
								<div className="text-2xl font-bold text-neutral-900">{offeringCount}</div>
								<div className="text-xs text-neutral-500">Available Offerings</div>
							</div>
						</div>
					</div>
				</div>
			)}
			
			{/* Filters */}
			<div className="glass-card rounded-xl p-4">
				<div className="flex flex-wrap items-center gap-4">
					<div className="flex items-center gap-2">
						<Filter className="w-4 h-4 text-neutral-500" />
						<span className="text-sm font-medium text-neutral-700">Filter:</span>
					</div>
					
					{/* Type filter */}
					<div className="flex gap-2">
						<button
							onClick={() => setTypeFilter('')}
							className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
								typeFilter === ''
									? 'bg-primary-600 text-white'
									: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
							}`}
						>
							All
						</button>
						<button
							onClick={() => setTypeFilter('REQUEST')}
							className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
								typeFilter === 'REQUEST'
									? 'bg-amber-500 text-white'
									: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
							}`}
						>
							Requests
						</button>
						<button
							onClick={() => setTypeFilter('OFFERING')}
							className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
								typeFilter === 'OFFERING'
									? 'bg-emerald-500 text-white'
									: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
							}`}
						>
							Offerings
						</button>
					</div>
					
					{/* Category filter */}
					<select
						value={categoryFilter}
						onChange={(e) => setCategoryFilter(e.target.value)}
						className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
					>
						<option value="">All Categories</option>
						{POST_CATEGORIES.map((cat) => (
							<option key={cat} value={cat}>{cat}</option>
						))}
					</select>
					
					{/* Refresh button */}
					<button
						onClick={fetchPosts}
						className="ml-auto p-2 hover:bg-neutral-100 rounded-lg transition-colors"
						title="Refresh"
					>
						<RefreshCw className={`w-4 h-4 text-neutral-500 ${isLoading ? 'animate-spin' : ''}`} />
					</button>
				</div>
			</div>
			
			{/* Posts grid */}
			{isLoading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="bg-white rounded-xl border border-neutral-200 p-5 animate-pulse">
							<div className="h-6 bg-neutral-200 rounded w-20 mb-3" />
							<div className="h-5 bg-neutral-200 rounded w-3/4 mb-2" />
							<div className="h-4 bg-neutral-200 rounded w-full mb-4" />
							<div className="h-3 bg-neutral-200 rounded w-1/3" />
						</div>
					))}
				</div>
			) : posts.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{posts.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</div>
			) : (
				<div className="text-center py-12 bg-white rounded-xl border border-neutral-200">
					<Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-neutral-900 mb-2">
						{statusFilter === 'FILLED' ? 'No fulfilled posts yet' : 'No posts yet'}
					</h3>
					<p className="text-neutral-600 mb-4">
						{statusFilter === 'FILLED'
							? 'Fulfilled requests and offerings will appear here.'
							: typeFilter || categoryFilter
								? 'No posts match your current filters.'
								: 'Be the first to post a request or share a resource!'}
					</p>
				{statusFilter === 'APPROVED' && (
					isSignedIn && verified ? (
						<Button onClick={() => setIsModalOpen(true)}>
							<Plus className="w-4 h-4 mr-2" />
							Create First Post
						</Button>
					) : (
						<div className="disabled-tooltip inline-block" data-tooltip="You need to signup and be a part of the chapter to use this feature">
							<Button 
								disabled 
								className="cursor-not-allowed opacity-60"
							>
								<Plus className="w-4 h-4 mr-2" />
								Create First Post
							</Button>
						</div>
					)
				)}
				</div>
			)}
			
			{/* Login prompt for non-signed-in users */}
			{!isSignedIn && (
				<div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-100">
					<h3 className="text-lg font-semibold text-neutral-900 mb-2">
						Want to post or respond?
					</h3>
					<p className="text-neutral-600 mb-4">
						Sign in to create resource requests, offer materials, and connect with other chapters.
					</p>
					<a href="/sign-in" className="inline-flex">
						<Button>Sign In to Get Started</Button>
					</a>
				</div>
			)}
			
			{/* Verification prompt for unverified users */}
			{isSignedIn && !verified && (
				<div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
					<h3 className="text-lg font-semibold text-neutral-900 mb-2">
						Account Pending Verification
					</h3>
					<p className="text-neutral-600">
						Your account is awaiting verification by your chapter admin. Once verified,
						you&apos;ll be able to create posts and respond to others.
					</p>
				</div>
			)}
			
			{/* Create Post Modal */}
			<CreatePostModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={fetchPosts}
				isAdmin={isAdmin}
			/>
		</div>
	)
}
