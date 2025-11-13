import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin" // Importar o cliente admin

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("[API Contact] Incoming request data:", data); // Log de entrada para depuração

    const supabase = createAdminClient() // Usar o cliente admin aqui

    // Preparar os dados, garantindo que campos NOT NULL sejam sempre strings não vazias após trim
    // e campos NULLABLE sejam null se vazios
    const companyName = (data.companyName && data.companyName.trim() !== '') ? data.companyName.trim() : null;
    const contactName = data.contactName ? data.contactName.trim() : '';
    const email = data.email ? data.email.trim() : '';
    const phone = data.phone ? data.phone.trim() : '';
    const address = (data.address && data.address.trim() !== '') ? data.address.trim() : null;
    const city = (data.city && data.city.trim() !== '') ? data.city.trim() : null;
    const state = (data.state && data.state.trim() !== '') ? data.state.trim() : null;
    
    // Constrói a mensagem final, incluindo o bairro se fornecido
    let finalMessage = (data.message && data.message.trim() !== '') ? data.message.trim() : null;
    if (data.neighborhood && data.neighborhood.trim() !== '') {
      finalMessage = finalMessage ? `${finalMessage}\nBairro: ${data.neighborhood.trim()}` : `Bairro: ${data.neighborhood.trim()}`;
    }

    // Validação básica no servidor para campos NOT NULL (embora Zod já faça isso no cliente)
    if (!contactName) {
      return NextResponse.json({ error: "Nome do contato é obrigatório." }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: "E-mail é obrigatório." }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ error: "Telefone é obrigatório." }, { status: 400 });
    }
    // A mensagem é nullable, então não precisa de validação de não-vazio aqui se for null

    const payload = {
      company_name: companyName,
      contact_name: contactName,
      email: email,
      phone: phone,
      address: address,
      city: city,
      state: state,
      product_interest: null, // Este campo é sempre null para o formulário de contato
      quantity: null,         // Este campo é sempre null para o formulário de contato
      message: finalMessage,  // Usa a mensagem final construída
    };

    console.log("[API Contact] Payload being sent to Supabase:", payload); // Log do payload para depuração

    const { error } = await supabase.from("quote_requests").insert([payload])

    if (error) {
      console.error("[API Contact] Error saving contact message to Supabase:", error);
      // Log do objeto de erro completo do Supabase para mais detalhes
      console.error("[API Contact] Supabase error details:", JSON.stringify(error, null, 2));
      return NextResponse.json({ error: error.message || "Erro ao salvar mensagem de contato" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) { // Explicitly type error as any for easier access to message
    console.error("[API Contact] Unexpected error in contact API:", error)
    return NextResponse.json({ error: error.message || "Erro ao processar solicitação" }, { status: 500 })
  }
}