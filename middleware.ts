import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  console.log(`[Middleware] Path: ${request.nextUrl.pathname}`);

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
          const allCookies = request.cookies.getAll();
          console.log(`[Middleware - getAll] Cookies received:`, allCookies.map(c => `${c.name}=${c.value.substring(0, 10)}...`)); // Log names and first few chars of values
          return allCookies;
        },
        setAll(cookiesToSet) {
          console.log(`[Middleware - setAll] Cookies to set:`, cookiesToSet.map(c => `${c.name}=${c.value.substring(0, 10)}...`));
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  // **Adicionado:** Refrescar a sessão e atualizar as cookies na resposta.
  // Isso é crucial para `supabase/ssr` manter a sessão viva entre as requisições.
  await supabase.auth.getSession();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    console.error("[Middleware] Supabase auth.getUser() error:", authError);
  }
  console.log(`[Middleware] User authenticated: ${!!user} (ID: ${user?.id})`);

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isClientRoute = request.nextUrl.pathname.startsWith("/client")
  const isLoginPage = request.nextUrl.pathname === "/admin/login"
  const isRegisterPage = request.nextUrl.pathname === "/admin/register"

  // Se o usuário está autenticado e tenta acessar a página de login/registro, redireciona para o dashboard admin (que o middleware resolverá)
  if (user && (isLoginPage || isRegisterPage)) {
    console.log(`[Middleware] Authenticated user trying to access login/register. Redirecting to /admin.`);
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Se o usuário NÃO está autenticado e tenta acessar a página de login/registro, permite o acesso
  if (!user && (isLoginPage || isRegisterPage)) {
    console.log(`[Middleware] Unauthenticated user accessing login/register. Allowing.`);
    return response;
  }

  // Para todas as outras rotas (admin ou client)
  let userRole: string | null = null;
  if (user) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profileError) {
        console.error("[Middleware] Error fetching user role from profiles:", profileError);
        userRole = null;
      } else if (profile) {
        userRole = profile.role;
      }
      console.log(`[Middleware] User role fetched: ${userRole} for user ID: ${user.id}`);
    } catch (e) {
      console.error("[Middleware] Exception fetching user role:", e);
      userRole = null;
    }
  }

  if (isAdminRoute) {
    if (user) {
      if (userRole === 'admin') {
        console.log("[Middleware] Authenticated admin accessing admin route. Allowing.");
        return response;
      } else {
        console.log("[Middleware] Authenticated non-admin (role: " + userRole + ") accessing admin route. Redirecting to client dashboard.");
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
        console.log("[Middleware] Authenticated client/admin accessing client route. Allowing.");
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