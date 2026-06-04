export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/competitors/:path*",
    "/sources/:path*",
    "/ask/:path*",
    "/research/:path*",
    "/reports/:path*",
    "/compare/:path*",
    "/api-settings/:path*",
    "/procurement/:path*",
    "/market/:path*",
  ],
};
