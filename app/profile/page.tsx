'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Key, CheckCircle, AlertCircle, Package, User, Edit2, Save, X } from 'lucide-react'
import { MyPostsList } from '@/components/posts/MyPostsList'

type AuthUser = {
	id: string
	email: string
	name: string
	role: string
	chapterId: string | null
	chapterName?: string
	verificationStatus: string
}

export default function ProfilePage() {
	const router = useRouter()
	const [user, setUser] = useState<AuthUser | null>(null)
	const [loading, setLoading] = useState(true)
	const [showPasswords, setShowPasswords] = useState(false)
	const [isChangingPassword, setIsChangingPassword] = useState(false)
	const [passwordSuccess, setPasswordSuccess] = useState(false)
	const [error, setError] = useState('')
	const [passwordForm, setPasswordForm] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	})
	
	// Name editing state
	const [isEditingName, setIsEditingName] = useState(false)
	const [newName, setNewName] = useState('')
	const [isUpdatingName, setIsUpdatingName] = useState(false)
	const [nameError, setNameError] = useState('')
	const [nameSuccess, setNameSuccess] = useState(false)

	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch('/api/auth/me')
				const data = await res.json()
				if (!data.user) {
					router.push('/sign-in')
					return
				}
				setUser(data.user)
				setNewName(data.user.name)
			} catch (err) {
				console.error('Failed to fetch user:', err)
				router.push('/sign-in')
			} finally {
				setLoading(false)
			}
		}
		fetchUser()
	}, [router])

	const handleNameUpdate = async (e: React.FormEvent) => {
		e.preventDefault()
		setNameError('')
		setNameSuccess(false)
		
		if (newName.trim().length < 2) {
			setNameError('Name must be at least 2 characters')
			return
		}
		
		setIsUpdatingName(true)
		
		try {
			const res = await fetch('/api/auth/update-profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: newName.trim() }),
			})
			
			const data = await res.json()
			
			if (!res.ok) {
				setNameError(data.error || 'Failed to update name')
				return
			}
			
			setUser(data.user)
			setNameSuccess(true)
			setIsEditingName(false)
			setTimeout(() => setNameSuccess(false), 3000)
		} catch {
			setNameError('Network error. Please try again.')
		} finally {
			setIsUpdatingName(false)
		}
	}

	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setPasswordSuccess(false)

		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			setError('New passwords do not match')
			return
		}

		setIsChangingPassword(true)

		try {
			const res = await fetch('/api/auth/change-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					currentPassword: passwordForm.currentPassword,
					newPassword: passwordForm.newPassword,
				}),
			})

			const data = await res.json()

			if (!res.ok) {
				setError(data.error || 'Failed to change password')
				return
			}

			setPasswordSuccess(true)
			setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
		} catch {
			setError('Network error. Please try again.')
		} finally {
			setIsChangingPassword(false)
		}
	}

	if (loading) {
		return (
			<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary-600" />
			</div>
		)
	}

	if (!user) return null

	const getRoleBadge = () => {
		switch (user.role) {
			case 'ADMIN':
				return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">WTSA Admin</span>
			case 'CHAPTER_ADMIN':
				return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Chapter Admin</span>
			case 'STUDENT':
				return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Student</span>
			default:
				return null
		}
	}

	const getStatusBadge = () => {
		switch (user.verificationStatus) {
			case 'APPROVED':
				return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Verified</span>
			case 'PENDING':
				return <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">Pending</span>
			case 'REJECTED':
				return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Rejected</span>
			default:
				return null
		}
	}

	return (
		<div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
			<div className="container mx-auto px-4 max-w-2xl">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

				{/* Profile Info Card */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
					<div className="flex items-start gap-4">
						<div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-2xl">
							{user.name.charAt(0).toUpperCase()}
						</div>
						<div className="flex-1">
							{isEditingName ? (
								<form onSubmit={handleNameUpdate} className="flex items-center gap-2 mb-2">
									<input
										type="text"
										value={newName}
										onChange={(e) => setNewName(e.target.value)}
										className="text-xl font-semibold text-gray-900 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
										autoFocus
									/>
									<button
										type="submit"
										disabled={isUpdatingName}
										className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
									>
										{isUpdatingName ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
									</button>
									<button
										type="button"
										onClick={() => {
											setIsEditingName(false)
											setNewName(user.name)
											setNameError('')
										}}
										className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
									>
										<X className="w-5 h-5" />
									</button>
								</form>
							) : (
								<div className="flex items-center gap-2 mb-1">
									<h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
									<button
										onClick={() => setIsEditingName(true)}
										className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
										title="Edit name"
									>
										<Edit2 className="w-4 h-4" />
									</button>
									{nameSuccess && (
										<span className="text-green-600 text-sm flex items-center gap-1">
											<CheckCircle className="w-4 h-4" /> Updated!
										</span>
									)}
								</div>
							)}
							{nameError && (
								<p className="text-red-600 text-sm mb-1">{nameError}</p>
							)}
							<p className="text-gray-600">{user.email}</p>
							<div className="flex flex-wrap gap-2 mt-2">
								{getRoleBadge()}
								{user.role === 'STUDENT' && getStatusBadge()}
							</div>
							{user.chapterName && (
								<p className="text-sm text-gray-500 mt-2">
									Chapter: {user.chapterName}
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Edit Profile Card */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
							<User className="w-5 h-5" />
							Account Settings
						</h2>
						<p className="text-sm text-gray-600">Manage your account information</p>
					</div>
					<div className="p-6">
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
								<div className="flex items-center gap-2">
									<input
										type="text"
										value={user.name}
										disabled
										className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
									/>
									<button
										onClick={() => {
											setNewName(user.name)
											setIsEditingName(true)
											setNameError('')
										}}
										className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium"
									>
										Edit
									</button>
								</div>
								<p className="text-xs text-gray-500 mt-1">This name is visible to other users</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
								<input
									type="email"
									value={user.email}
									disabled
									className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
								/>
								<p className="text-xs text-gray-500 mt-1">Contact your chapter admin to change your email</p>
							</div>
						</div>
					</div>
				</div>

				{/* My Posts Card */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
							<Package className="w-5 h-5" />
							My Resource Posts
						</h2>
						<p className="text-sm text-gray-600">Track your resource requests and offerings (including fulfilled ones)</p>
					</div>
					<MyPostsList />
				</div>

				{/* Change Password Card */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
							<Key className="w-5 h-5" />
							Change Password
						</h2>
					</div>

					<form onSubmit={handlePasswordChange} className="p-6 space-y-4">
						{error && (
							<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
								<AlertCircle className="w-4 h-4" />
								{error}
							</div>
						)}

						{passwordSuccess && (
							<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
								<CheckCircle className="w-4 h-4" />
								Password changed successfully!
							</div>
						)}

						<div>
							<label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
								Current Password
							</label>
							<div className="relative">
								<input
									id="currentPassword"
									type={showPasswords ? 'text' : 'password'}
									required
									value={passwordForm.currentPassword}
									onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
									className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
								/>
								<button
									type="button"
									onClick={() => setShowPasswords(!showPasswords)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
								>
									{showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
								</button>
							</div>
						</div>

						<div>
							<label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
								New Password
							</label>
							<input
								id="newPassword"
								type={showPasswords ? 'text' : 'password'}
								required
								minLength={8}
								value={passwordForm.newPassword}
								onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
								className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
							/>
							<p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
								Confirm New Password
							</label>
							<input
								id="confirmPassword"
								type={showPasswords ? 'text' : 'password'}
								required
								value={passwordForm.confirmPassword}
								onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
								className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
							/>
						</div>

						<button
							type="submit"
							disabled={isChangingPassword}
							className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
						>
							{isChangingPassword ? (
								<Loader2 className="w-5 h-5 animate-spin" />
							) : (
								'Change Password'
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
