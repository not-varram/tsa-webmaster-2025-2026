import Link from 'next/link'
import { Clock, Home, CheckCircle } from 'lucide-react'

export default function PendingVerificationPage() {
	return (
		<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100">
			<div className="w-full max-w-md text-center">
				{/* Icon */}
				<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full text-white mb-6 shadow-lg">
					<Clock className="w-10 h-10" />
				</div>

				{/* Content */}
				<h1 className="text-3xl font-bold text-gray-900 mb-4">Account Created!</h1>

				<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
					<div className="space-y-4 text-left">
						<div className="flex items-start gap-3">
							<CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
							<p className="text-gray-700">Your account has been created successfully.</p>
						</div>

						<div className="flex items-start gap-3">
							<Clock className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
							<p className="text-gray-700">
								You&apos;re on the <span className="font-semibold text-amber-600">waitlist</span> until your chapter admin verifies your account.
							</p>
						</div>

						<div className="border-t border-gray-200 pt-4 mt-4">
							<h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
							<ul className="text-sm text-gray-600 space-y-2">
								<li>• Your chapter admin will review your registration</li>
								<li>• Once verified, you&apos;ll have full access to all features</li>
								<li>• You can still browse public content while waiting</li>
							</ul>
						</div>
					</div>

					<div className="mt-6 flex flex-col gap-3">
						<Link
							href="/"
							className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg"
						>
							<Home className="w-5 h-5" />
							Go to Home
						</Link>

						<Link
							href="/resources"
							className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all"
						>
							Browse Resources
						</Link>
					</div>
				</div>

				<p className="mt-6 text-sm text-gray-500">
					Questions? Contact your chapter admin for assistance.
				</p>
			</div>
		</div>
	)
}

