import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

// Protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', 
  '/create(.*)', 
  '/course(.*)',
  '/quiz(.*)',
  '/exam(.*)'
]);

// Middleware function with route path tracking
const middleware = (req, evt) => {
  // Create a response that can be modified
  const response = NextResponse.next();
  
  // Add the current path as a header for server components to use
  response.headers.set('x-pathname', req.nextUrl.pathname);
  
  return response;
};

// Combine with Clerk middleware
export default clerkMiddleware((auth, req, evt) => {
  // Handle Clerk authentication
  if (isProtectedRoute(req)) {
    return auth.protect().then(() => middleware(req, evt));
  }
  
  // For non-protected routes, just run our middleware
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