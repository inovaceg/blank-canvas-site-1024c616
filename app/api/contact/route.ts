import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const supabase = await createClient()

    // Inserir na tabela quote_requests (agora usada para mensagens de contato também)
    const { error } = await supabase.from("quote_requests").insert([
      {
        company_name: data.company_name || null, // Pode ser nulo
        contact_name: data.contact_name,
        email: data.email,
        phone: data.phone,
        address: data.address, // Endereço completo construído no frontend
        city: data.city,
        state: data.state,
        product_interest: null, // Removido do formulário, enviar null
        quantity: null, // Removido do formulário, enviar null
        message: data.message,
      },
    ])

    if (error) {
      console.error("Error saving contact message:", error)
      return NextResponse.json({ error: "Erro ao salvar mensagem de contato" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in contact API:", error)
    return NextResponse.json({ error: "Erro ao processar solicitação" }, { status: 500 })
  }
}