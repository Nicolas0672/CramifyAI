import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

// Protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', 
  '/create(.*)', 
  '/course(.*)',
  '/quiz(.*)',
  '/exam(.*)',
  '/teach-me(.*)',
  '/create-teach-me(.*)'
]);

// Middleware function with route path tracking
const middleware = (req, evt) => {
  // Create a response that can be modified
  const response = NextResponse.next();
  
  // Add the current path as a header for server components to use
  response.headers.set('x-pathname', req.nextUrl.pathname);

  response.headers.set('x-search', req.nextUrl.search);
  
  // Handle root redirect to /home
  if (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '') {
    // When redirecting to home, add the fresh parameter
    const homeUrl = new URL('/home', req.url);
    homeUrl.searchParams.set('fresh', 'true');
    return NextResponse.redirect(homeUrl);
  }
  
  return response;
};

// Combine with Clerk middleware
export default clerkMiddleware((auth, req, evt) => {
  const pathname = req.nextUrl.pathname;

  // ✅ Skip auth for Inngest webhook
  if (pathname.startsWith("/api/inngest")) {
    return NextResponse.next(); // skip Clerk
  }

  if (isProtectedRoute(req)) {
    return auth.protect().then(() => middleware(req, evt));
  }

  return middleware(req, evt);
});


// Keep the same matcher configuration
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};