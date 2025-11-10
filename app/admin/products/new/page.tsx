"use client"

import { ProductForm } from "@/components/admin/product-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewProductPage() {
  return (
    <main className="p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#ff8800] mb-6"
        >
          <span>
            <ArrowLeft className="size-4" />
            Voltar para produtos
          </span>
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-[#4a4a4a] mb-6">Adicionar Novo Produto</h2>
          <ProductForm />
        </div>
      </div>
    </main>
  )
}