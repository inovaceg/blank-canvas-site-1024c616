import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin" // Importar o cliente admin

export async function POST(request: Request) {
  try {
    const orderData = await request.json()
    console.log("[API Orders] Incoming request data:", orderData); // Log de entrada para depuração

    const supabase = createAdminClient() // Usar o cliente admin aqui

    // Inserir os dados do pedido na tabela 'orders'
    const { data: newOrder, error: orderError } = await supabase
      .from("orders") // Nova tabela 'orders'
      .insert([
        {
          user_id: orderData.user_id, // ID do usuário logado
          client_id: orderData.client_id, // Adicionado: ID do cliente da tabela 'clients'
          company_name: orderData.company_name || null,
          contact_name: orderData.contact_name,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          state: orderData.state,
          product_details: orderData.product_details, // JSONB com detalhes dos produtos
          total_price: orderData.total_price, // Preço total do pedido
          status: orderData.status, // Status inicial (ex: 'pending')
          message: orderData.message, // Mensagem geral do pedido
        },
      ])
      .select()
      .single()

    if (orderError) {
      console.error("Error saving order:", orderError)
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, orderId: newOrder.id })
  } catch (error: any) {
    console.error("Error in order submission API:", error)
    return NextResponse.json({ error: error.message || "Erro ao processar pedido" }, { status: 500 })
  }
}