import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
	process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)
const COOKIE_NAME = 'auth_token'

// Routes that require authentication
const protectedRoutes = [
	'/dashboard',
	'/api/admin',
]

// Routes that require verified user status
const verifiedRoutes = [
	'/forum/new',
	'/api/forum/threads',
]

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Check if route requires authentication
	const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
	const isVerifiedRoute = verifiedRoutes.some(route => pathname.startsWith(route))

	if (!isProtectedRoute && !isVerifiedRoute) {
		return NextResponse.next()
	}

	// Get token from cookie
	const token = request.cookies.get(COOKIE_NAME)?.value

	if (!token) {
		// Redirect to sign-in for page routes, return 401 for API routes
		if (pathname.startsWith('/api/')) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
		return NextResponse.redirect(new URL('/sign-in', request.url))
	}

	try {
		// Verify token
		const { payload } = await jwtVerify(token, JWT_SECRET)

		// For verified routes, check verification status
		if (isVerifiedRoute) {
			const isAdmin = payload.role === 'ADMIN' || payload.role === 'CHAPTER_ADMIN'
			const isVerified = payload.verificationStatus === 'APPROVED'

			if (!isAdmin && !isVerified) {
				if (pathname.startsWith('/api/')) {
					return NextResponse.json(
						{ error: 'Account pending verification' },
						{ status: 403 }
					)
				}
				return NextResponse.redirect(new URL('/sign-up/pending', request.url))
			}
		}

		return NextResponse.next()
	} catch {
		// Invalid token - clear it and redirect
		const response = pathname.startsWith('/api/')
			? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
			: NextResponse.redirect(new URL('/sign-in', request.url))

		response.cookies.delete(COOKIE_NAME)
		return response
	}
}

export const config = {
	matcher: [
		// Match all routes except static files and Next.js internals
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
	],
}
