'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, LogOut, User, LayoutDashboard, Clock, ChevronDown } from 'lucide-react'

const navigation = [
	{ name: 'Home', href: '/' },
	{ name: 'Resource Hub', href: '/resources' },
	{ name: 'Chapters', href: '/chapters' },
	{ name: 'Events', href: '/events' },
	{ name: 'About', href: '/about' },
	{ name: 'For Judges', href: '/judges' },
]

type AuthUser = {
	id: string
	email: string
	name: string
	role: string
	chapterId: string | null
	chapterName?: string
	verificationStatus: string
} | null

export function Header() {
	const router = useRouter()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [userMenuOpen, setUserMenuOpen] = useState(false)
	const [user, setUser] = useState<AuthUser>(null)
	const [loading, setLoading] = useState(true)
	const [scrambledText, setScrambledText] = useState('Coalesce')

	// Scramble animation for "Coalesce"
	useEffect(() => {
		const targetText = 'Coalesce'
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*'
		let iteration = 0
		const maxIterations = targetText.length * 3

		const interval = setInterval(() => {
			setScrambledText(
				targetText
					.split('')
					.map((char, index) => {
						if (index < iteration / 3) {
							return targetText[index]
						}
						return chars[Math.floor(Math.random() * chars.length)]
					})
					.join('')
			)

			iteration += 1

			if (iteration >= maxIterations) {
				setScrambledText(targetText)
				clearInterval(interval)
			}
		}, 40)

		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch('/api/auth/me')
				const data = await res.json()
				setUser(data.user)
			} catch (err) {
				console.error('Failed to fetch user:', err)
			} finally {
				setLoading(false)
			}
		}
		fetchUser()
	}, [])

	const handleSignOut = async () => {
		try {
			await fetch('/api/auth/sign-out', { method: 'POST' })
			setUser(null)
			router.push('/')
			router.refresh()
		} catch (err) {
			console.error('Sign out failed:', err)
		}
	}

	const getDashboardLink = () => {
		if (user?.role === 'ADMIN') return '/dashboard/admin'
		if (user?.role === 'CHAPTER_ADMIN') return '/dashboard/chapter'
		return null
	}

	const isPending = user?.verificationStatus === 'PENDING'

	return (
		<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-sm">
			<nav className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex items-center">
						<Link href="/" className="flex items-center space-x-3">
							<Image
								src="/site-logo.png"
								alt="WTSA Coalesce Logo"
								width={48}
								height={48}
								className="rounded-lg"
							/>
							<span className="hidden sm:flex items-baseline gap-1.5">
								<span className="font-bold text-2xl text-neutral-900">WTSA</span>
								<span className="font-coalesce text-2xl italic text-primary-600 font-medium w-[105px]">{scrambledText}</span>
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center">
						{navigation.map((item, index) => (
							<div key={item.name} className="flex items-center">
								{index > 0 && (
									<span className="text-neutral-300 mx-1">/</span>
								)}
								<Link
									href={item.href}
									className="px-2 py-2 rounded-md text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-colors"
								>
									{item.name}
								</Link>
							</div>
						))}
					</div>

					{/* Auth Section */}
					<div className="hidden md:flex items-center space-x-3">
						{loading ? (
							<div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
						) : user ? (
							<div className="relative">
								<button
									onClick={() => setUserMenuOpen(!userMenuOpen)}
									className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
								>
									<div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm">
										{user.name.charAt(0).toUpperCase()}
									</div>
									<span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
										{user.name}
									</span>
									{isPending && (
										<Clock className="w-4 h-4 text-amber-500" />
									)}
									<ChevronDown className="w-4 h-4 text-gray-400" />
								</button>

								{userMenuOpen && (
									<>
										<div
											className="fixed inset-0 z-10"
											onClick={() => setUserMenuOpen(false)}
										/>
										<div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
											<div className="px-4 py-3 border-b border-gray-100">
												<p className="text-sm font-medium text-gray-900">{user.name}</p>
												<p className="text-xs text-gray-500 truncate">{user.email}</p>
												{isPending && (
													<p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
														<Clock className="w-3 h-3" />
														Pending verification
													</p>
												)}
											</div>

											{getDashboardLink() && (
												<Link
													href={getDashboardLink()!}
													className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
													onClick={() => setUserMenuOpen(false)}
												>
													<LayoutDashboard className="w-4 h-4" />
													Dashboard
												</Link>
											)}

											<Link
												href="/profile"
												className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
												onClick={() => setUserMenuOpen(false)}
											>
												<User className="w-4 h-4" />
												Profile
											</Link>

											<button
												onClick={() => {
													setUserMenuOpen(false)
													handleSignOut()
												}}
												className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
											>
												<LogOut className="w-4 h-4" />
												Sign Out
											</button>
										</div>
									</>
								)}
							</div>
						) : (
							<>
								<Link
									href="/sign-in"
									className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
								>
									Sign In
								</Link>
								<Link
									href="/sign-up"
									className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-medium rounded-lg hover:from-primary-700 hover:to-accent-700 transition-colors shadow-sm"
								>
									Sign Up
								</Link>
							</>
						)}
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<button
							type="button"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="p-2 rounded-md text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
							aria-label="Toggle menu"
						>
							{mobileMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{mobileMenuOpen && (
					<div className="md:hidden border-t border-neutral-200 py-4">
						<div className="flex flex-col space-y-2">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className="px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
									onClick={() => setMobileMenuOpen(false)}
								>
									{item.name}
								</Link>
							))}

							<div className="border-t border-gray-200 my-2 pt-2">
								{user ? (
									<>
										<div className="px-3 py-2 text-sm text-gray-500">
											Signed in as {user.name}
											{isPending && (
												<span className="ml-2 text-amber-600">(Pending)</span>
											)}
										</div>
										{getDashboardLink() && (
											<Link
												href={getDashboardLink()!}
												className="flex items-center gap-2 px-3 py-2 text-base font-medium text-neutral-700 hover:bg-primary-50"
												onClick={() => setMobileMenuOpen(false)}
											>
												<LayoutDashboard className="w-5 h-5" />
												Dashboard
											</Link>
										)}
										<button
											onClick={() => {
												setMobileMenuOpen(false)
												handleSignOut()
											}}
											className="w-full flex items-center gap-2 px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
										>
											<LogOut className="w-5 h-5" />
											Sign Out
										</button>
									</>
								) : (
									<>
										<Link
											href="/sign-in"
											className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-primary-50"
											onClick={() => setMobileMenuOpen(false)}
										>
											Sign In
										</Link>
										<Link
											href="/sign-up"
											className="block px-3 py-2 text-base font-medium text-primary-600 hover:bg-primary-50"
											onClick={() => setMobileMenuOpen(false)}
										>
											Sign Up
										</Link>
									</>
								)}
							</div>
						</div>
					</div>
				)}
			</nav>
		</header>
	)
}
