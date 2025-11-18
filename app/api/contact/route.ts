import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("[API Contact] Incoming request data:", data);

    const supabase = createAdminClient()

    const companyName = (data.companyName && data.companyName.trim() !== '') ? data.companyName.trim() : null;
    const contactName = data.contactName ? data.contactName.trim() : '';
    const email = data.email ? data.email.trim() : '';
    const phone = data.phone ? data.phone.trim() : '';
    const address = (data.address && data.address.trim() !== '') ? data.address.trim() : null;
    const city = (data.city && data.city.trim() !== '') ? data.city.trim() : null;
    const state = (data.state && data.state.trim() !== '') ? data.state.trim() : null;
    
    let finalMessage = (data.message && data.message.trim() !== '') ? data.message.trim() : null;
    if (data.neighborhood && data.neighborhood.trim() !== '') {
      finalMessage = finalMessage ? `${finalMessage}\nBairro: ${data.neighborhood.trim()}` : `Bairro: ${data.neighborhood.trim()}`;
    }

    if (!contactName) {
      return NextResponse.json({ error: "Nome do contato é obrigatório." }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: "E-mail é obrigatório." }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ error: "Telefone é obrigatório." }, { status: 400 });
    }

    const payload = {
      user_id: null, // Mensagens de contato não estão ligadas a um user_id específico
      company_name: companyName,
      contact_name: contactName,
      email: email,
      phone: phone,
      address: address,
      city: city,
      state: state,
      product_details: null, // Este campo é null para o formulário de contato
      total_price: null,     // Este campo é null para o formulário de contato
      status: 'contact_message', // Novo status para diferenciar mensagens de contato
      message: finalMessage,
    };

    console.log("[API Contact] Payload being sent to Supabase:", payload);

    const { error } = await supabase.from("orders").insert([payload]) // Inserir na tabela 'orders'

    if (error) {
      console.error("[API Contact] Error saving contact message to Supabase:", error);
      console.error("[API Contact] Supabase error details:", JSON.stringify(error, null, 2));
      return NextResponse.json({ error: error.message || "Erro ao salvar mensagem de contato" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[API Contact] Unexpected error in contact API:", error)
    return NextResponse.json({ error: error.message || "Erro ao processar solicitação" }, { status: 500 })
  }
}