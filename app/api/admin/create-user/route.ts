import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Email, password, first name, and last name are required." }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // Cria o usuário no sistema de autenticação do Supabase
    const { data: userResponse, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Confirma o e-mail automaticamente para facilitar o teste
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        // company_name e phone não são enviados aqui, mas os triggers devem lidar com isso
      },
    });

    if (authError) {
      console.error("Error creating user via admin API:", authError);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // Se o usuário foi criado com sucesso, os triggers handle_new_user e handle_new_client_on_user_signup
    // devem ter sido executados para popular as tabelas profiles e clients.

    return NextResponse.json({
      message: "User created successfully via admin API.",
      userId: userResponse.user?.id,
      email: userResponse.user?.email,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Unexpected error in admin create user API:", error);
    return NextResponse.json({ error: error.message || "Internal server error." }, { status: 500 });
  }
}