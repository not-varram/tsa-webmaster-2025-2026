'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'

export default function SignInPage() {
	const router = useRouter()
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		try {
			const res = await fetch('/api/auth/sign-in', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			})

			const data = await res.json()

			if (!res.ok) {
				setError(data.error || 'An error occurred')
				return
			}

			// Redirect based on role
			if (data.user.role === 'ADMIN') {
				router.push('/dashboard/admin')
			} else if (data.user.role === 'CHAPTER_ADMIN') {
				router.push('/dashboard/chapter')
			} else {
				router.push('/')
			}
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
					<h1 className="text-3xl font-bold text-neutral-900">Welcome back</h1>
					<p className="mt-2 text-neutral-600">Sign in to your WTSA Coalesce account</p>
				</div>

				{/* Form Card */}
				<div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral-200">
					<form onSubmit={handleSubmit} className="space-y-6">
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
								{error}
							</div>
						)}

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

						{/* Password */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? 'text' : 'password'}
									autoComplete="current-password"
									required
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
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
						>
							{isLoading ? (
								<Loader2 className="w-5 h-5 animate-spin" />
							) : (
								<>
									<LogIn className="w-5 h-5" />
									Sign In
								</>
							)}
						</button>
					</form>

					{/* Sign Up Link */}
					<p className="mt-6 text-center text-sm text-neutral-600">
						Don&apos;t have an account?{' '}
						<Link href="/sign-up" className="font-semibold text-primary-600 hover:text-primary-700">
							Create one
						</Link>
					</p>
				</div>

				{/* Footer Note */}
				<p className="mt-6 text-center text-xs text-neutral-500">
					Contact your chapter admin if you need help accessing your account.
				</p>
			</div>
		</div>
	)
}
