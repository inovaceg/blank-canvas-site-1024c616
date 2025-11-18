import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  console.log(`[Middleware] Path: ${request.nextUrl.pathname}`); // Log middleware entry

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
    error: authError, // Captura erros de autenticação
  } = await supabase.auth.getUser()

  if (authError) {
    console.error("[Middleware] Supabase auth.getUser() error:", authError);
    // Em caso de erro de autenticação, tratamos como usuário não autenticado para fins de redirecionamento.
  }

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isClientRoute = request.nextUrl.pathname.startsWith("/client")
  const isLoginPage = request.nextUrl.pathname === "/admin/login"
  const isRegisterPage = request.nextUrl.pathname === "/admin/register"

  // TEMPORÁRIO: Permite acesso irrestrito às páginas de login/registro para depuração
  if (isLoginPage || isRegisterPage) {
    console.log(`[Middleware] Allowing unconditional access to ${request.nextUrl.pathname} for debugging.`);
    return response;
  }

  // O restante da lógica de autenticação e redirecionamento só será executada para outras rotas
  // Fetch user role if authenticated
  let userRole: string | null = null;
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profileError) {
      console.error("Middleware: Error fetching user role from profiles:", profileError);
      // Se houver um erro ao buscar o perfil, assume-se que não há papel específico.
      userRole = null;
    } else if (profile) {
      userRole = profile.role;
    }
  }

  if (isAdminRoute) {
    if (user) {
      if (userRole === 'admin') {
        console.log("[Middleware] Authenticated admin accessing admin route.");
        return response;
      } else {
        console.log("[Middleware] Authenticated non-admin accessing admin route. Redirecting to client dashboard.");
        return NextResponse.redirect(new URL("/client/dashboard", request.url));
      }
    } else {
      console.log("[Middleware] Unauthenticated user accessing admin route. Redirecting to login.");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (isClientRoute) {
    if (user) {
      if (userRole === 'client' || userRole === 'admin') {
        console.log("[Middleware] Authenticated client/admin accessing client route.");
        return response;
      } else {
        console.log("[Middleware] Authenticated user with no client/admin role accessing client route. Redirecting to login.");
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } else {
      console.log("[Middleware] Unauthenticated user accessing client route. Redirecting to login.");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  console.log("[Middleware] Allowing access to non-admin/non-client route.");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
}