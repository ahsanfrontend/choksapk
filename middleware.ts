import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Note: In a production Edge environment, you'd use a KV store or an API call.
// For this environment, we will attempt to fetch active redirects or use an internal resolver.
async function resolveRedirect(path: string, baseUrl: string) {
    try {
        // We call our internal resolution API which has DB access
        const res = await fetch(`${baseUrl}/api/redirects/resolve?path=${encodeURIComponent(path)}`);
        if (res.ok) {
            return await res.json();
        }
    } catch (err) {
        return null;
    }
    return null;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const baseUrl = request.nextUrl.origin;

    // 0. Early return for manifest and static files (before any processing)
    if (pathname === '/manifest.json' || pathname === '/robots.txt' || pathname === '/sitemap.xml') {
        return NextResponse.next();
    }

    // 1. Handle Dynamic Redirects
    // Skip for API, Admin routes, and static assets to prevent loops and ensure management is always accessible
    const isStaticAsset = pathname.includes('.') || pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico');

    if (!pathname.startsWith('/api') && !pathname.startsWith('/admin') && !isStaticAsset) {
        const redirection = await resolveRedirect(pathname, baseUrl);
        if (redirection) {
            return NextResponse.redirect(new URL(redirection.destinationPath, request.url), redirection.type || 301);
        }
    }

    // 1. Handle Admin Page Redirects
    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const payload = await verifyToken(token);
        const hasAccess = payload && (payload.role === 'super_admin' || payload.role === 'admin');

        if (!hasAccess) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // 2. Disable Public Registration
    if (pathname === '/register') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. Handle API Security
    if (pathname.startsWith('/api')) {
        // Allow public authentication and redirect resolution routes
        const isPublicRoute =
            pathname === '/api/auth/login' ||
            pathname === '/api/auth/logout' ||
            pathname === '/api/redirects/resolve' ||
            pathname === '/api/setup/admin' || // Allow setup route for initial admin creation
            pathname === '/api/debug'; // Temporary debug endpoint

        if (isPublicRoute) {
            return NextResponse.next();
        }

        // Block public registration API
        if (pathname === '/api/auth/register') {
            return new NextResponse(
                JSON.stringify({ error: 'Public registration disabled' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Require admin or super_admin for all other API routes
        const token = request.cookies.get('token')?.value;
        const payload = token ? await verifyToken(token) : null;
        const isAdmin = payload && (payload.role === 'super_admin' || payload.role === 'admin');

        if (!isAdmin) {
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized Access Prohibited' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (public auth endpoints)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - manifest.json
         * - robots.txt
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.json|robots.txt).*)',
    ],
}

