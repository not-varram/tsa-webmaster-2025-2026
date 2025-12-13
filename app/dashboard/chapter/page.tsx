import { redirect } from 'next/navigation'
import { getSession, isChapterAdmin, getCurrentUser } from '@/lib/auth'
import { StudentManagement } from '@/components/dashboard/StudentManagement'
import { PendingPostsManagement } from '@/components/dashboard/PendingPostsManagement'
import prisma from '@/lib/db'
import { UserRole, VerificationStatus, PostStatus } from '@prisma/client'

export default async function ChapterDashboardPage() {
	const session = await getSession()

	if (!session) {
		redirect('/sign-in')
	}

	const canAccess = await isChapterAdmin()
	if (!canAccess) {
		redirect('/')
	}

	const user = await getCurrentUser()
	if (!user || !user.chapterId) {
		redirect('/')
	}

	// Get chapter info
	const chapter = await prisma.chapter.findUnique({
		where: { id: user.chapterId },
	})

	// Get students in this chapter
	const students = await prisma.user.findMany({
		where: {
			chapterId: user.chapterId,
			role: UserRole.STUDENT,
		},
		orderBy: [
			{ verificationStatus: 'asc' },
			{ createdAt: 'desc' },
		],
		select: {
			id: true,
			name: true,
			email: true,
			verificationStatus: true,
			createdAt: true,
			verifiedAt: true,
			verifiedBy: {
				select: { name: true },
			},
		},
	})

	// Get pending resource posts from chapter members
	const pendingPosts = await prisma.resourcePost.findMany({
		where: {
			chapterId: user.chapterId,
			status: PostStatus.PENDING,
		},
		include: {
			author: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
		orderBy: { createdAt: 'asc' },
	})

	const pendingStudentCount = students.filter(s => s.verificationStatus === VerificationStatus.PENDING).length
	const approvedCount = students.filter(s => s.verificationStatus === VerificationStatus.APPROVED).length

	return (
		<div className="min-h-[calc(100vh-4rem)] bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Chapter Dashboard</h1>
					<p className="text-gray-600 mt-1">{chapter?.name} - {chapter?.schoolName}</p>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
					<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
						<div className="text-3xl font-bold text-gray-900">{students.length}</div>
						<div className="text-gray-600">Total Students</div>
					</div>
					<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
						<div className="text-3xl font-bold text-amber-600">{pendingStudentCount}</div>
						<div className="text-gray-600">Pending Verification</div>
					</div>
					<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
						<div className="text-3xl font-bold text-green-600">{approvedCount}</div>
						<div className="text-gray-600">Verified Students</div>
					</div>
					<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
						<div className="text-3xl font-bold text-blue-600">{pendingPosts.length}</div>
						<div className="text-gray-600">Pending Posts</div>
					</div>
				</div>

				{/* Pending Posts */}
				{pendingPosts.length > 0 && (
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
						<div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
							<h2 className="text-xl font-semibold text-gray-900">Review Resource Posts</h2>
							<p className="text-sm text-gray-600">
								{pendingPosts.length} post{pendingPosts.length !== 1 ? 's' : ''} awaiting your approval
							</p>
						</div>
						<PendingPostsManagement
							posts={pendingPosts.map(p => ({
								...p,
								createdAt: p.createdAt.toISOString(),
							}))}
						/>
					</div>
				)}

				{/* Student Management */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-xl font-semibold text-gray-900">Manage Students</h2>
						<p className="text-sm text-gray-600">Verify students and manage their accounts</p>
					</div>
					<StudentManagement
						students={students.map(s => ({
							...s,
							createdAt: s.createdAt.toISOString(),
							verifiedAt: s.verifiedAt?.toISOString() || null,
							verifiedByName: s.verifiedBy?.name || null,
						}))}
						chapterId={user.chapterId}
					/>
				</div>
			</div>
		</div>
	)
}

