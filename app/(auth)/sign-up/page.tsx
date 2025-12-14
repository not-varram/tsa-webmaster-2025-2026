'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, UserPlus, Loader2, AlertCircle, Info } from 'lucide-react'

type Chapter = {
	id: string
	name: string
	schoolName: string
}

export default function SignUpPage() {
	const router = useRouter()
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [chapters, setChapters] = useState<Chapter[]>([])
	const [loadingChapters, setLoadingChapters] = useState(true)
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		chapterId: '',
	})

	useEffect(() => {
		async function fetchChapters() {
			try {
				const res = await fetch('/api/chapters')
				const data = await res.json()
				setChapters(data.chapters || [])
			} catch (err) {
				console.error('Failed to load chapters:', err)
			} finally {
				setLoadingChapters(false)
			}
		}
		fetchChapters()
	}, [])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		// Validate passwords match
		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match')
			setIsLoading(false)
			return
		}

		try {
			const res = await fetch('/api/auth/sign-up', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					password: formData.password,
					chapterId: formData.chapterId,
				}),
			})

			const data = await res.json()

			if (!res.ok) {
				setError(data.error || 'An error occurred')
				return
			}

			// Redirect to pending page or home
			router.push('/sign-up/pending')
			router.refresh()
		} catch (err) {
			setError('Network error. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md">
				{/* Logo/Header */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl text-white font-bold text-2xl mb-4 shadow-lg">
						W
					</div>
					<h1 className="text-3xl font-bold text-neutral-900">Create your account</h1>
					<p className="mt-2 text-neutral-600">Join your chapter on WTSA Coalesce</p>
				</div>

				{/* Form Card */}
				<div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-200">
					<form onSubmit={handleSubmit} className="space-y-5">
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
								<AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
								{error}
							</div>
						)}

						{/* Name */}
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
								Full name
							</label>
							<input
								id="name"
								type="text"
								autoComplete="name"
								required
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
								placeholder="John Doe"
							/>
						</div>

						{/* Email */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
								Email address
							</label>
							<input
								id="email"
								type="email"
								autoComplete="email"
								required
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
								placeholder="you@example.com"
							/>
						</div>

						{/* Chapter Selection */}
						<div>
							<label htmlFor="chapter" className="block text-sm font-medium text-neutral-700 mb-1">
								Your chapter
							</label>
							<select
								id="chapter"
								required
								value={formData.chapterId}
								onChange={(e) => setFormData({ ...formData, chapterId: e.target.value })}
								className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none bg-white"
								disabled={loadingChapters}
							>
								<option value="">
									{loadingChapters ? 'Loading chapters...' : 'Select your chapter'}
								</option>
								{chapters.map((chapter) => (
									<option key={chapter.id} value={chapter.id}>
										{chapter.name} - {chapter.schoolName}
									</option>
								))}
							</select>
						</div>

						{/* Password */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? 'text' : 'password'}
									autoComplete="new-password"
									required
									minLength={8}
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									className="w-full px-4 py-3 pr-12 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
									placeholder="••••••••"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
								>
									{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
								</button>
							</div>
							<p className="mt-1 text-xs text-neutral-500">Must be at least 8 characters</p>
						</div>

						{/* Confirm Password */}
						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
								Confirm password
							</label>
							<input
								id="confirmPassword"
								type={showPassword ? 'text' : 'password'}
								autoComplete="new-password"
								required
								value={formData.confirmPassword}
								onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
								className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
								placeholder="••••••••"
							/>
						</div>

						{/* Info Box */}
						<div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
							<Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
							<p>
								After signing up, your chapter admin will need to verify your account before you can access all features.
							</p>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading || loadingChapters}
							className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
						>
							{isLoading ? (
								<Loader2 className="w-5 h-5 animate-spin" />
							) : (
								<>
									<UserPlus className="w-5 h-5" />
									Create Account
								</>
							)}
						</button>
					</form>

					{/* Sign In Link */}
					<p className="mt-6 text-center text-sm text-neutral-600">
						Already have an account?{' '}
						<Link href="/sign-in" className="font-semibold text-primary-600 hover:text-primary-700">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
