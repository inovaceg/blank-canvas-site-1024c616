import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isClientRoute = request.nextUrl.pathname.startsWith("/client")
  const isLoginPage = request.nextUrl.pathname === "/admin/login"
  const isRegisterPage = request.nextUrl.pathname === "/admin/register"

  // Fetch user role if authenticated
  let userRole: string | null = null;
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile && !profileError) {
      userRole = profile.role;
    }
  }

  if (isAdminRoute) {
    if (user) {
      // If authenticated, check role for admin access
      if (userRole === 'admin') {
        // Admins can access admin pages
        if (isLoginPage || isRegisterPage) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        return response;
      } else {
        // Non-admins trying to access admin pages are redirected to client dashboard or login
        if (isLoginPage || isRegisterPage) {
          return NextResponse.redirect(new URL("/client/dashboard", request.url));
        }
        return NextResponse.redirect(new URL("/client/dashboard", request.url));
      }
    } else {
      // If not authenticated
      if (isLoginPage || isRegisterPage) {
        return response; // Allow access to login/register
      } else {
        return NextResponse.redirect(new URL("/admin/login", request.url)); // Redirect to login for other admin routes
      }
    }
  }

  if (isClientRoute) {
    if (user) {
      // If authenticated, check role for client access
      if (userRole === 'client' || userRole === 'admin') { // Admins can also access client area
        if (isLoginPage || isRegisterPage) { // Should not happen if already authenticated
          return NextResponse.redirect(new URL("/client/dashboard", request.url));
        }
        return response;
      } else {
        // Users with other roles (or no role) trying to access client pages
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } else {
      // If not authenticated, redirect to login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // For non-admin and non-client routes, just return the response
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
}