'use client'

import { useState } from 'react'
import {
	CheckCircle,
	XCircle,
	Key,
	Clock,
	Loader2,
	Copy,
	Check,
	UserCheck,
	UserX,
	AlertTriangle,
} from 'lucide-react'
import { VerificationStatus } from '@prisma/client'

type Student = {
	id: string
	name: string
	email: string
	verificationStatus: VerificationStatus
	createdAt: string
	verifiedAt: string | null
	verifiedByName: string | null
}

type Props = {
	students: Student[]
	chapterId: string
}

export function StudentManagement({ students: initialStudents, chapterId }: Props) {
	const [students, setStudents] = useState(initialStudents)
	const [loadingId, setLoadingId] = useState<string | null>(null)
	const [tempPassword, setTempPassword] = useState<{ id: string; password: string } | null>(null)
	const [copied, setCopied] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleVerify = async (studentId: string, approve: boolean) => {
		setLoadingId(studentId)
		setError(null)

		try {
			const res = await fetch(`/api/admin/students/${studentId}/verify`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ approve }),
			})

			const data = await res.json()

			if (!res.ok) {
				setError(data.error || 'Failed to update student')
				return
			}

			// Update local state
			setStudents(prev =>
				prev.map(s =>
					s.id === studentId
						? { ...s, verificationStatus: data.student.verificationStatus }
						: s
				)
			)
		} catch (err) {
			setError('Network error. Please try again.')
		} finally {
			setLoadingId(null)
		}
	}

	const handleResetPassword = async (studentId: string) => {
		if (!confirm('Are you sure you want to reset this student\'s password?')) return

		setLoadingId(studentId)
		setError(null)
		setTempPassword(null)

		try {
			const res = await fetch(`/api/admin/students/${studentId}/reset-password`, {
				method: 'POST',
			})

			const data = await res.json()

			if (!res.ok) {
				setError(data.error || 'Failed to reset password')
				return
			}

			setTempPassword({ id: studentId, password: data.tempPassword })
		} catch (err) {
			setError('Network error. Please try again.')
		} finally {
			setLoadingId(null)
		}
	}

	const copyPassword = async () => {
		if (tempPassword) {
			await navigator.clipboard.writeText(tempPassword.password)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		}
	}

	const getStatusBadge = (status: VerificationStatus) => {
		switch (status) {
			case 'PENDING':
				return (
					<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
						<Clock className="w-3 h-3" /> Pending
					</span>
				)
			case 'APPROVED':
				return (
					<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
						<CheckCircle className="w-3 h-3" /> Verified
					</span>
				)
			case 'REJECTED':
				return (
					<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
						<XCircle className="w-3 h-3" /> Rejected
					</span>
				)
		}
	}

	if (students.length === 0) {
		return (
			<div className="p-12 text-center text-gray-500">
				<UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
				<p className="text-lg font-medium">No students yet</p>
				<p className="text-sm">Students who sign up for your chapter will appear here.</p>
			</div>
		)
	}

	return (
		<div className="divide-y divide-gray-200">
			{error && (
				<div className="p-4 bg-red-50 border-b border-red-200 text-red-700 text-sm flex items-center gap-2">
					<AlertTriangle className="w-4 h-4" />
					{error}
				</div>
			)}

			{tempPassword && (
				<div className="p-4 bg-blue-50 border-b border-blue-200">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium text-blue-900">Temporary Password Generated</p>
							<p className="text-sm text-blue-700">Share this securely with the student:</p>
							<code className="mt-1 block font-mono text-lg text-blue-900 bg-white px-3 py-1 rounded border">
								{tempPassword.password}
							</code>
						</div>
						<button
							onClick={copyPassword}
							className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
							{copied ? 'Copied!' : 'Copy'}
						</button>
					</div>
					<button
						onClick={() => setTempPassword(null)}
						className="mt-2 text-sm text-blue-600 hover:underline"
					>
						Dismiss
					</button>
				</div>
			)}

			{students.map((student) => (
				<div key={student.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
								{student.name.charAt(0).toUpperCase()}
							</div>
							<div className="min-w-0">
								<p className="font-medium text-gray-900 truncate">{student.name}</p>
								<p className="text-sm text-gray-500 truncate">{student.email}</p>
							</div>
						</div>
						<div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
							{getStatusBadge(student.verificationStatus)}
							<span>• Joined {new Date(student.createdAt).toLocaleDateString()}</span>
							{student.verifiedByName && (
								<span>• Verified by {student.verifiedByName}</span>
							)}
						</div>
					</div>

					<div className="flex items-center gap-2 flex-shrink-0">
						{student.verificationStatus === 'PENDING' && (
							<>
								<button
									onClick={() => handleVerify(student.id, true)}
									disabled={loadingId === student.id}
									className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm font-medium"
								>
									{loadingId === student.id ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<UserCheck className="w-4 h-4" />
									)}
									Approve
								</button>
								<button
									onClick={() => handleVerify(student.id, false)}
									disabled={loadingId === student.id}
									className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm font-medium"
								>
									{loadingId === student.id ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<UserX className="w-4 h-4" />
									)}
									Reject
								</button>
							</>
						)}

						{student.verificationStatus === 'APPROVED' && (
							<button
								onClick={() => handleResetPassword(student.id)}
								disabled={loadingId === student.id}
								className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm font-medium"
							>
								{loadingId === student.id ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Key className="w-4 h-4" />
								)}
								Reset Password
							</button>
						)}

						{student.verificationStatus === 'REJECTED' && (
							<button
								onClick={() => handleVerify(student.id, true)}
								disabled={loadingId === student.id}
								className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm font-medium"
							>
								{loadingId === student.id ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<UserCheck className="w-4 h-4" />
								)}
								Re-approve
							</button>
						)}
					</div>
				</div>
			))}
		</div>
	)
}

