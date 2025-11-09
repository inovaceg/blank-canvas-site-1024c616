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
        whatsapp: data.whatsapp || null,
      },
    ])

    if (error) {
      console.error("Error saving newsletter subscription:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error in newsletter route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}