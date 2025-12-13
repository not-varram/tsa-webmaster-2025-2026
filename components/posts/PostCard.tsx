'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, User, MapPin, ArrowRight, Package, Search } from 'lucide-react'

type PostCardProps = {
	post: {
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
}

export function PostCard({ post }: PostCardProps) {
	const isRequest = post.type === 'REQUEST'
	const isFilled = post.status === 'FILLED'
	
	return (
		<Link href={`/resources/posts/${post.id}`}>
			<article className="group relative bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-lg hover:border-primary-300 transition-all duration-200">
				{/* Type badge */}
				<div className="flex items-center justify-between mb-3">
					<span
						className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
							isRequest
								? 'bg-amber-100 text-amber-800'
								: 'bg-emerald-100 text-emerald-800'
						}`}
					>
						{isRequest ? <Search className="w-3 h-3" /> : <Package className="w-3 h-3" />}
						{isRequest ? 'Looking for' : 'Offering'}
					</span>
					
					{isFilled && (
						<span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
							✓ Fulfilled
						</span>
					)}
				</div>
				
				{/* Title */}
				<h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
					{post.title}
				</h3>
				
				{/* Description preview */}
				<p className="text-neutral-600 text-sm line-clamp-2 mb-4">
					{post.description}
				</p>
				
				{/* Category tag */}
				<div className="flex flex-wrap gap-2 mb-4">
					<span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-xs">
						{post.category}
					</span>
					{post.tags.slice(0, 2).map((tag) => (
						<span
							key={tag}
							className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs"
						>
							{tag}
						</span>
					))}
				</div>
				
				{/* Meta info */}
				<div className="flex items-center justify-between text-xs text-neutral-500 pt-3 border-t border-neutral-100">
					<div className="flex items-center gap-3">
						<span className="flex items-center gap-1">
							<User className="w-3.5 h-3.5" />
							{post.author.name}
						</span>
						{post.chapter && (
							<span className="flex items-center gap-1">
								<MapPin className="w-3.5 h-3.5" />
								{post.chapter.name}
							</span>
						)}
					</div>
					
					<div className="flex items-center gap-3">
						{post._count && (
							<span className="flex items-center gap-1">
								<MessageSquare className="w-3.5 h-3.5" />
								{post._count.comments}
							</span>
						)}
						<span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
					</div>
				</div>
				
				{/* Hover indicator */}
				<div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
					<ArrowRight className="w-5 h-5 text-primary-500" />
				</div>
			</article>
		</Link>
	)
}

