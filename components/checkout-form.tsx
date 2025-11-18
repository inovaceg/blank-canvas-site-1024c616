"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { createClient } from "@/lib/supabase/client" // Importar cliente Supabase para obter user_id

// Esquema de validação para o formulário de checkout
const checkoutSchema = z.object({
  documentType: z.enum(["cpf", "cnpj"], { message: "Selecione o tipo de documento" }),
  documentNumber: z.string().min(11, "Documento inválido").max(18, "Documento inválido"),
  companyName: z.string().min(2, "Nome da empresa deve ter no mínimo 2 caracteres").optional(),
  fullName: z.string().min(3, "Nome completo deve ter no mínimo 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(14, "Telefone/WhatsApp inválido (ex: 22-9-8888-8888)").max(14, "Telefone/WhatsApp inválido (ex: 22-9-8888-8888)"), // Atualizado para 14 caracteres
  cep: z.string().min(9, "CEP inválido (ex: 00000-000)").max(9, "CEP inválido (ex: 00000-000)"), // Atualizado para 9 caracteres
  address: z.string().min(3, "Endereço inválido"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro inválido"),
  city: z.string().min(2, "Cidade inválida"),
  state: z.string().min(2, "Estado inválido").max(2, "Estado inválido"),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean
}

export function CheckoutForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { cartItems, clearCart, getTotalPrice } = useCart()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      documentType: "cpf",
    },
  })

  const watchedCep = watch("cep")
  const watchedDocumentType = watch("documentType")

  // Efeito para preencher o endereço automaticamente ao digitar o CEP
  useEffect(() => {
    const fetchAddress = async () => {
      const cepValue = watchedCep?.replace(/\D/g, ''); // Remove caracteres não numéricos
      if (cepValue && cepValue.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`)
          if (!response.ok) {
            // Se a resposta não for OK (ex: 404, 500), lançar um erro
            throw new Error(`Erro HTTP: ${response.status}`);
          }
          const data: ViaCepResponse = await response.json()

          if (!data.erro) {
            setValue("address", data.logradouro)
            setValue("neighborhood", data.bairro)
            setValue("city", data.localidade)
            setValue("state", data.uf)
            toast.success("Endereço preenchido automaticamente!")
          } else {
            toast.error("CEP não encontrado. Por favor, digite o endereço manualmente.")
            setValue("address", "")
            setValue("neighborhood", "")
            setValue("city", "")
            setValue("state", "")
          }
        } catch (error) {
          console.error("Erro ao buscar CEP:", error)
          toast.error("Erro ao buscar CEP. Verifique o número e sua conexão com a internet.")
          // Limpa os campos se houver erro na busca
          setValue("address", "")
          setValue("neighborhood", "")
          setValue("city", "")
          setValue("state", "")
        }
      }
    }
    fetchAddress()
  }, [watchedCep, setValue])

  // Função para mascarar o telefone
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Remove todos os caracteres não numéricos
    let cleanedValue = value.replace(/\D/g, '');

    // Aplica a máscara: XX-X-XXXX-XXXX
    let formattedValue = '';
    if (cleanedValue.length > 0) {
      formattedValue = cleanedValue.substring(0, 2); // XX
      if (cleanedValue.length > 2) {
        formattedValue += '-' + cleanedValue.substring(2, 3); // X
      }
      if (cleanedValue.length > 3) {
        formattedValue += '-' + cleanedValue.substring(3, 7); // XXXX
      }
      if (cleanedValue.length > 7) {
        formattedValue += '-' + cleanedValue.substring(7, 11); // XXXX
      }
    }
    setValue('phone', formattedValue, { shouldValidate: true });
  };

  // Função para mascarar o CEP
  const handleCepInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let cleanedValue = value.replace(/\D/g, ''); // Remove caracteres não numéricos

    let formattedValue = '';
    if (cleanedValue.length > 0) {
      formattedValue = cleanedValue.substring(0, 5); // XXXXX
      if (cleanedValue.length > 5) {
        formattedValue += '-' + cleanedValue.substring(5, 8); // XXX
      }
    }
    setValue('cep', formattedValue, { shouldValidate: true });
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)

    if (cartItems.length === 0) {
      toast.error("Seu carrinho está vazio. Adicione produtos antes de enviar o pedido.")
      setIsSubmitting(false)
      return
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error("Você precisa estar logado para finalizar o pedido.");
        router.push("/admin/login"); // Redireciona para o login
        setIsSubmitting(false);
        return;
      }

      const orderData = {
        user_id: user.id, // ID do usuário logado
        company_name: data.companyName || null,
        contact_name: data.fullName,
        email: data.email,
        phone: data.phone,
        address: `${data.address}, ${data.number}${data.complement ? `, ${data.complement}` : ''}`,
        city: data.city,
        state: data.state,
        product_details: cartItems.map(item => ({ // Armazena os detalhes do carrinho como JSONB
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          weight: item.weight,
          units_per_package: item.units_per_package,
          image_url: item.image_url,
        })),
        total_price: getTotalPrice(), // Preço total do carrinho
        status: 'pending', // Status inicial do pedido
        message: `Pedido de ${data.fullName} (${data.email}) - Doc. ${data.documentType}: ${data.documentNumber}. Endereço: ${data.address}, ${data.number}, ${data.neighborhood}, ${data.city}-${data.state}, CEP: ${data.cep}.`,
      };

      const response = await fetch("/api/orders", { // Nova rota da API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao enviar pedido");
      }

      toast.success("Pedido enviado com sucesso! Entraremos em contato em breve.")
      clearCart()
      reset()
      router.push("/client/dashboard"); // Redirecionar para o dashboard do cliente
    } catch (error: any) {
      console.error("Erro ao finalizar pedido:", error);
      toast.error(error.message || "Erro ao finalizar pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Tipo de Documento</Label>
        <RadioGroup
          onValueChange={(value) => setValue("documentType", value as "cpf" | "cnpj")}
          defaultValue="cpf"
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cpf" id="cpf" />
            <Label htmlFor="cpf">CPF</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cnpj" id="cnpj" />
            <Label htmlFor="cnpj">CNPJ</Label>
          </div>
        </RadioGroup>
        {errors.documentType && <p className="text-sm text-destructive">{errors.documentType.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="documentNumber">{watchedDocumentType === "cpf" ? "CPF" : "CNPJ"} *</Label>
        <Input
          id="documentNumber"
          placeholder={watchedDocumentType === "cpf" ? "000.000.000-00" : "00.000.000/0000-00"}
          {...register("documentNumber")}
          aria-invalid={!!errors.documentNumber}
        />
        {errors.documentNumber && <p className="text-sm text-destructive">{errors.documentNumber.message}</p>}
      </div>

      {watchedDocumentType === "cnpj" && (
        <div className="space-y-2">
          <Label htmlFor="companyName">Nome da Empresa *</Label>
          <Input id="companyName" placeholder="Nome da sua empresa" {...register("companyName")} aria-invalid={!!errors.companyName} />
          {errors.companyName && <p className="text-sm text-destructive">{errors.companyName.message}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName">Nome Completo *</Label>
        <Input id="fullName" placeholder="Seu nome completo" {...register("fullName")} aria-invalid={!!errors.fullName} />
        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail *</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone / WhatsApp *</Label>
        <Input
          id="phone"
          placeholder="XX-X-XXXX-XXXX"
          {...register("phone")}
          onChange={handlePhoneInputChange} // Usando a função de mascaramento
          aria-invalid={!!errors.phone}
          maxLength={14} // Definindo o comprimento máximo para o formato mascarado
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cep">CEP *</Label>
        <Input
          id="cep"
          placeholder="00000-000"
          {...register("cep")}
          onChange={handleCepInputChange} // Usando a função de mascaramento
          aria-invalid={!!errors.cep}
          maxLength={9} // Definindo o comprimento máximo para o formato mascarado
        />
        {errors.cep && <p className="text-sm text-destructive">{errors.cep.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço *</Label>
        <Input id="address" placeholder="Rua, Avenida, etc." {...register("address")} aria-invalid={!!errors.address} />
        {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="number">Número *</Label>
          <Input id="number" placeholder="123" {...register("number")} aria-invalid={!!errors.number} />
          {errors.number && <p className="text-sm text-destructive">{errors.number.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="complement">Complemento (Opcional)</Label>
          <Input id="complement" placeholder="Apto 101, Bloco B" {...register("complement")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="neighborhood">Bairro *</Label>
        <Input id="neighborhood" placeholder="Seu bairro" {...register("neighborhood")} aria-invalid={!!errors.neighborhood} />
        {errors.neighborhood && <p className="text-sm text-destructive">{errors.neighborhood.message}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="city">Cidade *</Label>
          <Input id="city" placeholder="Sua cidade" {...register("city")} aria-invalid={!!errors.city} />
          {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado (UF) *</Label>
          <Input id="state" placeholder="RJ" {...register("state")} aria-invalid={!!errors.state} maxLength={2} />
          {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Enviando Pedido...
          </>
        ) : (
          "Confirmar Pedido"
        )}
      </Button>
    </form>
  )
}