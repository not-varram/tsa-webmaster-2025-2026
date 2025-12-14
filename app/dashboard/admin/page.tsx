import { redirect } from 'next/navigation'
import { getSession, isWTSAAdmin } from '@/lib/auth'
import prisma from '@/lib/db'
import { UserRole, VerificationStatus } from '@prisma/client'
import Link from 'next/link'
import { Users, BookOpen, Calendar, Building2 } from 'lucide-react'

export default async function AdminDashboardPage() {
	const session = await getSession()

	if (!session) {
		redirect('/sign-in')
	}

	const isAdmin = await isWTSAAdmin()
	if (!isAdmin) {
		redirect('/')
	}

	// Get stats
	const [chaptersCount, studentsCount, pendingCount, resourcesCount] = await Promise.all([
		prisma.chapter.count(),
		prisma.user.count({ where: { role: UserRole.STUDENT } }),
		prisma.user.count({ where: { verificationStatus: VerificationStatus.PENDING } }),
		prisma.resource.count(),
	])

	// Get chapters with student counts
	const chapters = await prisma.chapter.findMany({
		include: {
			_count: {
				select: {
					users: { where: { role: UserRole.STUDENT } },
				},
			},
		},
		orderBy: { name: 'asc' },
	})

	return (
		<div className="min-h-[calc(100vh-4rem)]">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-neutral-900">WTSA Admin Dashboard</h1>
					<p className="text-neutral-600 mt-1">Manage chapters, students, and resources</p>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
					<div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
						<div className="flex items-center gap-3">
							<div className="p-3 bg-blue-100 rounded-lg">
								<Building2 className="w-6 h-6 text-blue-600" />
							</div>
							<div>
								<div className="text-2xl font-bold text-neutral-900">{chaptersCount}</div>
								<div className="text-neutral-600 text-sm">Chapters</div>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
						<div className="flex items-center gap-3">
							<div className="p-3 bg-green-100 rounded-lg">
								<Users className="w-6 h-6 text-green-600" />
							</div>
							<div>
								<div className="text-2xl font-bold text-neutral-900">{studentsCount}</div>
								<div className="text-neutral-600 text-sm">Students</div>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
						<div className="flex items-center gap-3">
							<div className="p-3 bg-amber-100 rounded-lg">
								<Users className="w-6 h-6 text-amber-600" />
							</div>
							<div>
								<div className="text-2xl font-bold text-neutral-900">{pendingCount}</div>
								<div className="text-neutral-600 text-sm">Pending Verification</div>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
						<div className="flex items-center gap-3">
							<div className="p-3 bg-purple-100 rounded-lg">
								<BookOpen className="w-6 h-6 text-purple-600" />
							</div>
							<div>
								<div className="text-2xl font-bold text-neutral-900">{resourcesCount}</div>
								<div className="text-neutral-600 text-sm">Resources</div>
							</div>
						</div>
					</div>
				</div>

				{/* Chapters List */}
				<div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
					<div className="px-6 py-4 border-b border-neutral-200">
						<h2 className="text-xl font-semibold text-neutral-900">All Chapters</h2>
					</div>
					<div className="divide-y divide-neutral-200">
						{chapters.map((chapter) => (
							<div key={chapter.id} className="p-6 flex items-center justify-between">
								<div>
									<h3 className="font-medium text-neutral-900">{chapter.name}</h3>
									<p className="text-sm text-neutral-500">{chapter.schoolName} • {chapter.city}</p>
									<p className="text-sm text-neutral-500 mt-1">
										{chapter._count.users} students • {chapter.adminEmails.length} admin(s)
									</p>
								</div>
								<Link
									href={`/chapters/${chapter.slug}`}
									className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium"
								>
									View Chapter
								</Link>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
