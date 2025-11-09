import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const supabase = await createClient()

    // Inserir na tabela quote_requests
    const { error } = await supabase.from("quote_requests").insert([
      {
        company_name: data.company_name,
        contact_name: data.contact_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        product_interest: data.product_interest,
        quantity: data.quantity,
        message: data.message,
      },
    ])

    if (error) {
      console.error("Error saving quote request:", error)
      return NextResponse.json({ error: "Erro ao salvar solicitação de orçamento" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in quote request API:", error)
    return NextResponse.json({ error: "Erro ao processar solicitação" }, { status: 500 })
  }
}