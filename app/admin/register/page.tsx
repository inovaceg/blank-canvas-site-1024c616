import { RegisterForm } from "@/components/admin/register-form"
import Image from "next/image"
import Link from "next/link"

export default function AdminRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f1ed] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative size-16">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Design%20sem%20nome%20%281%29%20%281%29-vqBz106SPSsejO2YFogjWyruHk8EV4.png"
                alt="Doces São Fidélis"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#4a4a4a] mb-2">Criar Nova Conta</h1>
          <p className="text-[#6b6b6b]">Preencha seus dados para se cadastrar</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-[#6b6b6b]">
            Já tem uma conta?{" "}
            <Link href="/admin/login" className="text-[#ff8800] hover:underline">
              Faça login aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}