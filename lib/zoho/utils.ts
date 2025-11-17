import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin"; // Para atualizar tokens com service role

interface ZohoTokens {
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  scope?: string;
}

const ZOHO_ACCOUNTS_URL = "https://accounts.zoho.com";
const ZOHO_MAIL_API_BASE_URL = "https://mail.zoho.com/api/organization"; // Base URL para a Zoho Mail Organization API

export async function getZohoTokensForUser(): Promise<ZohoTokens | null> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Erro ao buscar usuário para tokens Zoho:", userError);
    return null;
  }

  const { data, error } = await supabase
    .from("zoho_tokens")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Erro ao buscar tokens Zoho do DB:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  // Verifica se o token está expirado ou prestes a expirar (ex: dentro de 5 minutos)
  const expiresAt = new Date(data.expires_at).getTime();
  const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;

  if (expiresAt < fiveMinutesFromNow) {
    console.log("Token de acesso Zoho expirado ou próximo de expirar. Tentando atualizar...");
    const refreshedTokens = await refreshZohoAccessToken(data.refresh_token, user.id);
    if (refreshedTokens) {
      return { ...data, ...refreshedTokens }; // Retorna tokens atualizados
    } else {
      console.error("Falha ao atualizar token Zoho.");
      return null; // Não foi possível atualizar, token inválido
    }
  }

  return data;
}

async function refreshZohoAccessToken(refreshToken: string, userId: string): Promise<{ access_token: string; expires_at: string; scope?: string } | null> {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("ZOHO_CLIENT_ID ou ZOHO_CLIENT_SECRET não configurados.");
    return null;
  }

  try {
    const response = await fetch(`${ZOHO_ACCOUNTS_URL}/oauth/v2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
      }).toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao atualizar token Zoho:", errorData);
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.access_token;
    const newExpiresIn = data.expires_in; // segundos
    const newScope = data.scope;

    const newExpiresAt = new Date(Date.now() + newExpiresIn * 1000).toISOString();

    // Atualiza os tokens no Supabase usando o cliente admin (server-side)
    const supabaseAdmin = createAdminClient();
    const { error: updateError } = await supabaseAdmin
      .from("zoho_tokens")
      .update({
        access_token: newAccessToken,
        expires_at: newExpiresAt,
        scope: newScope || null, // Atualiza o scope se fornecido
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Erro ao atualizar tokens Zoho no DB após refresh:", updateError);
      return null;
    }

    console.log("Token Zoho atualizado e salvo no DB com sucesso.");
    return { access_token: newAccessToken, expires_at: newExpiresAt, scope: newScope };
  } catch (error) {
    console.error("Erro inesperado durante a atualização do token Zoho:", error);
    return null;
  }
}

// Helper para obter o ID da organização (zoid)
export function getZohoOrganizationId(): string | null {
  return process.env.ZOHO_ORGANIZATION_ID || null;
}

export { ZOHO_MAIL_API_BASE_URL };