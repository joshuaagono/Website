import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/profile(.*)", "/admin(.*)", "/analytics(.*)", "/api/admin(.*)", "/api/profile(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js|jpe?g|webp|png|gif|svg|ico|woff2?|ttf)).*)", "/(api|trpc)(.*)"]
};
