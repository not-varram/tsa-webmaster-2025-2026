import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Must match lib/auth.ts - production requires JWT_SECRET env var
const JWT_SECRET_STRING = process.env.JWT_SECRET
if (!JWT_SECRET_STRING || JWT_SECRET_STRING.length < 32) {
	throw new Error('JWT_SECRET environment variable must be set and at least 32 characters in production')
}
const JWT_SECRET = new TextEncoder().encode(
	JWT_SECRET_STRING || 'dev-only-secret-key-minimum-32-chars'
)
const COOKIE_NAME = 'auth_token'

// Routes that require authentication
const protectedRoutes = [
	'/dashboard',
	'/profile',
	'/api/admin',
	'/api/auth/change-password',
	'/api/auth/update-profile',
]

// Routes that require verified user status (authenticated + verified)
const verifiedRoutes = [
	'/forum/new',
	'/api/forum/threads',
	'/api/posts', // POST requires verification (GET is public for approved posts)
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
