import { LoginForm } from "@/components/admin/login-form"
import Image from "next/image"

export default function AdminLoginPage() {
  console.log("[AdminLoginPage] Rendering server component."); // Log para depuração

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f1ed] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative size-16">
              <Image
                src="/logo-doces-sao-fidelis.png"
                alt="Doces São Fidélis"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#4a4a4a] mb-2">Painel Administrativo</h1>
          <p className="text-[#6b6b6b]">Entre com suas credenciais para acessar</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}