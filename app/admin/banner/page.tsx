"use client"

import Link from "next/link"
import { ArrowLeft, Image as ImageIcon } from "lucide-react"
import { BannerForm } from "@/components/admin/banner-form"

export default function AdminBannerPage() {
  return (
    <main className="p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#ff8800] mb-6"
        >
          <span>
            <ArrowLeft className="size-4" />
            Voltar para o Dashboard
          </span>
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-[#4a4a4a] mb-6">Gerenciar Banner da Página Inicial</h2>
          <BannerForm />
        </div>
      </div>
    </main>
  )
}