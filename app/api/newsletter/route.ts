import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const supabase = await createClient()

    const { error } = await supabase.from("newsletter_subscribers").insert([
      {
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        city: data.city,
      },
    ])

    if (error) {
      console.error("Error saving newsletter subscription:", error)
      // Retorna a mensagem de erro do Supabase para o cliente
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) { // Explicitly type error as any for easier access to message
    console.error("Error in newsletter route:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}