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

    // 0. Handle Dynamic Redirects
    // Skip for API and Admin routes to prevent loops and ensure management is always accessible
    if (!pathname.startsWith('/api') && !pathname.startsWith('/admin') && !pathname.startsWith('/_next')) {
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
        // Allow public authentication routes
        const isPublicAuth = pathname === '/api/auth/login' ||
            pathname === '/api/auth/logout';

        if (isPublicAuth) {
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
    matcher: ['/admin/:path*', '/api/:path*'],
}
