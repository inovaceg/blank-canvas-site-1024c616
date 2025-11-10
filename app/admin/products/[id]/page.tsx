"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ProductForm } from "@/components/admin/product-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { ProductFormData } from "@/components/admin/product-form" // Importar o tipo ProductFormData

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  // Inicializa o estado 'product' como undefined para corresponder ao tipo esperado pelo ProductForm
  const [product, setProduct] = useState<(ProductFormData & { id: string }) | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    const { data } = await supabase.from("products").select("*").eq("id", params.id).single()

    if (!data) {
      router.push("/admin/products")
      return
    }

    // Garante que o tipo de 'data' corresponde ao tipo do estado
    setProduct(data as ProductFormData & { id: string })
    setLoading(false)
  }

  if (loading) {
    return (
      <main className="p-8">
        <div className="text-center py-12">Carregando...</div>
      </main>
    )
  }

  // Adiciona uma verificação para garantir que 'product' não é undefined antes de renderizar ProductForm
  if (!product) {
    return (
      <main className="p-8">
        <div className="text-center py-12">Produto não encontrado ou erro de carregamento.</div>
      </main>
    )
  }

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
          <h2 className="text-2xl font-bold text-[#4a4a4a] mb-6">Editar Produto</h2>
          <ProductForm product={product} />
        </div>
      </div>
    </main>
  )
}