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

  let userRole: string | null = null;
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile in middleware:", profileError);
    } else if (profile) {
      userRole = profile.role;
    }
  }

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isClientRoute = request.nextUrl.pathname.startsWith("/client")
  const isLoginPage = request.nextUrl.pathname === "/admin/login"
  const isRegisterPage = request.nextUrl.pathname === "/admin/register"

  if (isAdminRoute) {
    if (user && userRole === 'admin') {
      // Se o admin está autenticado e tentando acessar login/registro, redireciona para o dashboard admin
      if (isLoginPage || isRegisterPage) {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
      // Se admin autenticado e acessando outras rotas admin, permite
      return response
    } else if (user && userRole === 'client') {
      // Se um cliente está tentando acessar uma rota admin, redireciona para o dashboard do cliente
      return NextResponse.redirect(new URL("/client", request.url))
    } else {
      // Se o usuário NÃO está autenticado
      if (isLoginPage || isRegisterPage) {
        // Permite acesso às páginas de login/registro
        return response
      } else {
        // Redireciona usuários não autenticados de outras rotas admin para o login
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }
    }
  }

  if (isClientRoute) {
    if (user && userRole === 'client') {
      // Se o cliente está autenticado e acessando rotas de cliente, permite
      return response
    } else if (user && userRole === 'admin') {
      // Se um admin está tentando acessar uma rota de cliente, redireciona para o dashboard do admin
      return NextResponse.redirect(new URL("/admin", request.url))
    } else {
      // Se o usuário NÃO está autenticado, redireciona para o login (que pode ser o admin/login por enquanto)
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Para rotas que não são de administração ou cliente, apenas retorna a resposta (a sessão pode ter sido atualizada)
  return response
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
}