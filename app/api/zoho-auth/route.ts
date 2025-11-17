import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isLocal = searchParams.get("local") === "true";

  const clientId = process.env.ZOHO_CLIENT_ID;
  const redirectUri = isLocal ? process.env.ZOHO_REDIRECT_URI_LOCAL : process.env.ZOHO_REDIRECT_URI_PROD;
  const scope = "ZohoMail.organization.accounts.ALL"; // Usando ALL para ter todas as permissões de gerenciamento de contas
  const accessType = "offline"; // Para obter um refresh token

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Variáveis de ambiente ZOHO_CLIENT_ID ou ZOHO_REDIRECT_URI não configuradas." },
      { status: 500 }
    );
  }

  const authUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=${scope}&client_id=${clientId}&response_type=code&access_type=${accessType}&redirect_uri=${redirectUri}`;

  return NextResponse.redirect(authUrl);
}