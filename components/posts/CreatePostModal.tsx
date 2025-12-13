'use client'

import { useState } from 'react'
import { X, Loader2, Search, Package } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const POST_CATEGORIES = [
	'Technical Materials',
	'Building Materials',
	'Equipment',
	'Competition Resources',
	'Software/Digital',
	'Other',
]

type CreatePostModalProps = {
	isOpen: boolean
	onClose: () => void
	onSuccess: () => void
	isAdmin?: boolean
}

export function CreatePostModal({ isOpen, onClose, onSuccess, isAdmin = false }: CreatePostModalProps) {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [formData, setFormData] = useState({
		type: 'REQUEST' as 'REQUEST' | 'OFFERING',
		title: '',
		description: '',
		category: '',
		tags: '',
	})
	
	if (!isOpen) return null
	
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError('')
		setIsLoading(true)
		
		try {
			const tagsArray = formData.tags
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean)
			
			const res = await fetch('/api/posts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					tags: tagsArray,
				}),
			})
			
			const data = await res.json()
			
			if (!res.ok) {
				throw new Error(data.error || 'Failed to create post')
			}
			
			onSuccess()
			onClose()
			setFormData({
				type: 'REQUEST',
				title: '',
				description: '',
				category: '',
				tags: '',
			})
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong')
		} finally {
			setIsLoading(false)
		}
	}
	
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>
			
			{/* Modal */}
			<div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 rounded-t-2xl">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-bold text-neutral-900">
							Create Resource Post
						</h2>
						<button
							onClick={onClose}
							className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
						>
							<X className="w-5 h-5" />
						</button>
					</div>
				</div>
				
				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-5">
					{error && (
						<div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
							{error}
						</div>
					)}
					
					{/* Post Type Selection */}
					<div>
						<label className="block text-sm font-medium text-neutral-700 mb-3">
							What are you posting?
						</label>
						<div className="grid grid-cols-2 gap-3">
							<button
								type="button"
								onClick={() => setFormData((f) => ({ ...f, type: 'REQUEST' }))}
								className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
									formData.type === 'REQUEST'
										? 'border-amber-500 bg-amber-50'
										: 'border-neutral-200 hover:border-neutral-300'
								}`}
							>
								<div className={`p-2 rounded-lg ${
									formData.type === 'REQUEST' ? 'bg-amber-200' : 'bg-neutral-100'
								}`}>
									<Search className="w-5 h-5 text-amber-700" />
								</div>
								<div className="text-left">
									<div className="font-semibold text-neutral-900">Request</div>
									<div className="text-xs text-neutral-500">Looking for something</div>
								</div>
							</button>
							
							<button
								type="button"
								onClick={() => setFormData((f) => ({ ...f, type: 'OFFERING' }))}
								className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
									formData.type === 'OFFERING'
										? 'border-emerald-500 bg-emerald-50'
										: 'border-neutral-200 hover:border-neutral-300'
								}`}
							>
								<div className={`p-2 rounded-lg ${
									formData.type === 'OFFERING' ? 'bg-emerald-200' : 'bg-neutral-100'
								}`}>
									<Package className="w-5 h-5 text-emerald-700" />
								</div>
								<div className="text-left">
									<div className="font-semibold text-neutral-900">Offering</div>
									<div className="text-xs text-neutral-500">Share a resource</div>
								</div>
							</button>
						</div>
					</div>
					
					{/* Title */}
					<div>
						<label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1.5">
							Title *
						</label>
						<input
							id="title"
							type="text"
							required
							placeholder={formData.type === 'REQUEST'
								? 'e.g., Looking for Arduino sensors for robotics project'
								: 'e.g., Offering spare 3D printer filament'}
							value={formData.title}
							onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
							className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						/>
					</div>
					
					{/* Category */}
					<div>
						<label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1.5">
							Category *
						</label>
						<select
							id="category"
							required
							value={formData.category}
							onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
							className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
						>
							<option value="">Select a category</option>
							{POST_CATEGORIES.map((cat) => (
								<option key={cat} value={cat}>{cat}</option>
							))}
						</select>
					</div>
					
					{/* Description */}
					<div>
						<label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1.5">
							Description *
						</label>
						<textarea
							id="description"
							required
							rows={4}
							placeholder={formData.type === 'REQUEST'
								? 'Describe what you need, quantity, specifications, and when you need it by...'
								: 'Describe what you\'re offering, condition, quantity available, and any terms...'}
							value={formData.description}
							onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
							className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
						/>
					</div>
					
					{/* Tags */}
					<div>
						<label htmlFor="tags" className="block text-sm font-medium text-neutral-700 mb-1.5">
							Tags (optional)
						</label>
						<input
							id="tags"
							type="text"
							placeholder="e.g., electronics, robotics, urgent (comma separated)"
							value={formData.tags}
							onChange={(e) => setFormData((f) => ({ ...f, tags: e.target.value }))}
							className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
						/>
						<p className="text-xs text-neutral-500 mt-1">
							Separate tags with commas
						</p>
					</div>
					
					{/* Info notice */}
					{isAdmin ? (
						<div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
							<strong>Admin:</strong> Your post will be published immediately without review.
						</div>
					) : (
						<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
							<strong>Note:</strong> Your post will be reviewed by an admin before appearing publicly.
							You&apos;ll be notified once it&apos;s approved.
						</div>
					)}
					
					{/* Actions */}
					<div className="flex gap-3 pt-2">
						<Button
							type="button"
							variant="ghost"
							onClick={onClose}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isLoading}
							className="flex-1"
						>
							{isLoading ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									{isAdmin ? 'Publishing...' : 'Submitting...'}
								</>
							) : (
								isAdmin ? 'Publish Post' : 'Submit for Review'
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}

