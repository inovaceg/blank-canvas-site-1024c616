import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("[API Contact] Incoming request data:", data); // Log de entrada

    const supabase = await createClient()

    // Extrair e preparar os dados, convertendo strings vazias para null para campos opcionais
    const payload = {
      company_name: data.companyName || null, // Converte "" para null
      contact_name: data.contactName,
      email: data.email,
      phone: data.phone,
      address: data.address || null, // Converte "" para null
      city: data.city || null,       // Converte "" para null
      state: data.state || null,     // Converte "" para null
      product_interest: null, // Este campo é sempre null para o formulário de contato
      quantity: null,         // Este campo é sempre null para o formulário de contato
      message: data.message,  // 'message' é obrigatório no formulário, então não será ""
    };

    console.log("[API Contact] Payload being sent to Supabase:", payload); // Log do payload

    const { error } = await supabase.from("quote_requests").insert([payload])

    if (error) {
      console.error("[API Contact] Error saving contact message to Supabase:", error); // Log do erro completo do Supabase
      return NextResponse.json({ error: error.message || "Erro ao salvar mensagem de contato" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) { // Explicitly type error as any for easier access to message
    console.error("[API Contact] Unexpected error in contact API:", error) // Log de erros inesperados
    return NextResponse.json({ error: error.message || "Erro ao processar solicitação" }, { status: 500 })
  }
}