"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client"; // Cliente Supabase para sessão do usuário

interface ZohoUser {
  zuid: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  status: string; // e.g., "Active", "Inactive"
  // Adicione outros campos relevantes da resposta da API Zoho
}

export default function ZohoMailManagementPage() {
  const supabase = createClient();
  const [hasZohoTokens, setHasZohoTokens] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [zohoUsers, setZohoUsers] = useState<ZohoUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    checkZohoAuthStatus();
  }, []);

  const checkZohoAuthStatus = async () => {
    setLoadingAuth(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setHasZohoTokens(false);
        setLoadingAuth(false);
        return;
      }

      // Verifica se zoho_tokens existem para este usuário
      const { data, error } = await supabase
        .from("zoho_tokens")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

      if (data && !error) {
        setHasZohoTokens(true);
        fetchZohoUsers(); // Busca usuários se autenticado
      } else {
        setHasZohoTokens(false);
      }
    } catch (error) {
      console.error("Erro ao verificar status de autenticação Zoho:", error);
      toast.error("Erro ao verificar status de autenticação Zoho.");
      setHasZohoTokens(false);
    } finally {
      setLoadingAuth(false);
    }
  };

  const fetchZohoUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch("/api/zoho-mail/users");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao buscar usuários Zoho.");
      }
      const data = await response.json();
      setZohoUsers(data.users || []);
    } catch (error: any) {
      console.error("Erro ao buscar usuários Zoho:", error);
      toast.error(error.message || "Erro ao carregar usuários Zoho.");
      setZohoUsers([]);
      setHasZohoTokens(false); // Se a busca de usuários falhar, assume que os tokens podem estar inválidos
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAuthorizeZoho = () => {
    window.location.href = `/api/zoho-auth?local=${window.location.hostname === "localhost"}`;
  };

  if (loadingAuth) {
    return (
      <main className="p-8">
        <div className="text-center py-12 flex flex-col items-center justify-center">
          <Loader2 className="size-8 animate-spin text-gray-500 mb-4" />
          <p>Verificando autenticação Zoho...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#ff8800] mb-6"
        >
          <span>
            <ArrowLeft className="size-4" />
            Voltar para o Dashboard
          </span>
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-[#4a4a4a] mb-6">Gerenciar E-mails Zoho</h2>

          {!hasZohoTokens ? (
            <div className="text-center py-12 space-y-4">
              <Mail className="size-16 text-gray-400 mx-auto" />
              <h3 className="text-xl font-semibold text-[#4a4a4a]">Autenticação Zoho Necessária</h3>
              <p className="text-[#6b6b6b]">
                Para gerenciar e-mails, você precisa autorizar o acesso à sua organização Zoho Mail.
              </p>
              <Button onClick={handleAuthorizeZoho} className="bg-[#ff8800] hover:bg-[#e67700]">
                Autorizar Zoho Mail
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-[#4a4a4a]">Contas de E-mail</h3>
                <Button className="bg-[#ff8800] hover:bg-[#e67700]">
                  <Plus className="size-4 mr-2" />
                  Criar Novo E-mail
                </Button>
              </div>

              {loadingUsers ? (
                <div className="text-center py-8 flex flex-col items-center justify-center">
                  <Loader2 className="size-6 animate-spin text-gray-500 mb-4" />
                  <p>Carregando usuários Zoho...</p>
                </div>
              ) : zohoUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Nenhum usuário Zoho encontrado.</div>
              ) : (
                <div className="overflow-x-auto border rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {zohoUsers.map((user) => (
                        <tr key={user.zuid}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.emailAddress}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.firstName} {user.lastName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.status}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon-sm" title="Editar">
                                <Pencil className="size-4" />
                              </Button>
                              <Button variant="destructive" size="icon-sm" title="Excluir">
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}