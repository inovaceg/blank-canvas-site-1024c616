import { NextResponse, type NextRequest } from "next/server"
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server" // Import the server client

export async function middleware(request: NextRequest) {
  // Permite acesso às páginas de login e registro sem autenticação
  if (request.nextUrl.pathname === "/admin/login" || request.nextUrl.pathname === "/admin/register") {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Usa a função centralizada para criar o cliente Supabase no servidor
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redireciona para a página de login se o usuário não estiver autenticado e tentar acessar uma rota admin
  if (request.nextUrl.pathname.startsWith("/admin") && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}