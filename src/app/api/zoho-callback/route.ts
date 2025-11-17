import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // Para armazenar os tokens de forma segura

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const isLocal = request.headers.get("host")?.includes("localhost");

  if (!code) {
    return NextResponse.json({ error: "Código de autorização não encontrado." }, { status: 400 });
  }

  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const redirectUri = isLocal ? process.env.ZOHO_REDIRECT_URI_LOCAL : process.env.ZOHO_REDIRECT_URI_PROD;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: "Variáveis de ambiente Zoho não configuradas corretamente." },
      { status: 500 }
    );
  }

  try {
    const tokenResponse = await fetch("https://accounts.zoho.com/oauth/v2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Erro ao trocar código por token Zoho:", errorData);
      return NextResponse.json({ error: "Falha ao obter tokens do Zoho.", details: errorData }, { status: 500 });
    }

    const tokens = await tokenResponse.json();
    console.log("Tokens Zoho obtidos com sucesso:", tokens);

    // Armazenar os tokens de forma segura.
    // Sugestão: Armazenar no Supabase em uma tabela 'zoho_tokens'
    // Você precisará criar esta tabela e garantir RLS adequado.
    const supabase = await createClient();
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError || !user.user) {
      console.error("Usuário não autenticado para armazenar tokens Zoho:", userError);
      return NextResponse.json({ error: "Usuário não autenticado. Não foi possível armazenar tokens Zoho." }, { status: 401 });
    }

    const { error: dbError } = await supabase.from("zoho_tokens").upsert(
      {
        user_id: user.user.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        scope: tokens.scope,
      },
      { onConflict: "user_id" }
    );

    if (dbError) {
      console.error("Erro ao salvar tokens Zoho no Supabase:", dbError);
      return NextResponse.json({ error: "Erro ao salvar tokens Zoho no banco de dados." }, { status: 500 });
    }

    // Redirecionar para o painel administrativo com uma mensagem de sucesso
    return NextResponse.redirect(new URL("/admin?zoho_auth=success", request.url));

  } catch (error: any) {
    console.error("Erro inesperado no callback Zoho:", error);
    return NextResponse.json({ error: "Erro inesperado durante a autenticação Zoho.", details: error.message }, { status: 500 });
  }
}