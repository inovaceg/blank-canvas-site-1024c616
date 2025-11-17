import { NextResponse } from "next/server";
import { getZohoTokensForUser, getZohoOrganizationId, ZOHO_MAIL_API_BASE_URL } from "@/lib/zoho/utils";

export async function GET() {
  try {
    const zohoTokens = await getZohoTokensForUser();
    if (!zohoTokens) {
      return NextResponse.json({ error: "Autenticação Zoho necessária ou tokens expirados." }, { status: 401 });
    }

    const zoid = getZohoOrganizationId();
    if (!zoid) {
      return NextResponse.json({ error: "ID da Organização Zoho (ZOHO_ORGANIZATION_ID) não configurado." }, { status: 500 });
    }

    const response = await fetch(`${ZOHO_MAIL_API_BASE_URL}/${zoid}/accounts/`, {
      method: "GET",
      headers: {
        "Authorization": `Zoho-oauthtoken ${zohoTokens.access_token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao buscar usuários Zoho da API:", errorData);
      return NextResponse.json({ error: errorData.message || "Falha ao buscar usuários Zoho." }, { status: response.status });
    }

    const data = await response.json();
    // A estrutura da resposta da API Zoho pode variar.
    // Assumindo que retorna um objeto com um array 'data' contendo objetos de usuário.
    // Ajuste isso com base na documentação real da API Zoho.
    const users = data.data || []; // Ajuste com base na estrutura real da resposta da API Zoho

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Erro inesperado ao buscar usuários Zoho:", error);
    return NextResponse.json({ error: error.message || "Erro interno do servidor." }, { status: 500 });
  }
}