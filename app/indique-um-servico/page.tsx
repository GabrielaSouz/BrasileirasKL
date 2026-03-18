"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"
import { HeartIcon, Undo2 } from "lucide-react"

interface ServiceForm {
  name: string
  phone: string
  serviceName: string
  description: string
  address: string
  phoneService: string
  link?: string
}

export default function IndiqueServico() {
  const [form, setForm] = useState<ServiceForm>({
    name: "",
    phone: "",
    serviceName: "",
    description: "",
    address: "",
    phoneService: "",
    link: ""
  })
  const [loading, setLoading] = useState(false)

  function handleInputChange(field: keyof ServiceForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/indicar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error("Erro ao enviar")

      toast.success("✅ Indicação enviada com sucesso!")

      setForm({
        name: "",
        phone: "",
        serviceName: "",
        description: "",
        address: "",
        phoneService: "",
        link: ""
      })
    } catch (error) {
      toast.error("Erro ao enviar indicação. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">

          <Link href="/" className="flex justify-center items-center space-x-2 mb-4">
            <div className="flex justify-center items-center bg-emerald-600 p-1.5 rounded-lg hover:bg-emerald-500 transition-colors">
              <Undo2 className="h-3 w-3 text-white " />
            </div>
            <h1 className="text-sm font-serif text-slate-800 tracking-tight hover:text-emerald-500 transition-colors">Voltar para tela inicial</h1>
          </Link>


          <h1 className="text-base md:text-2xl text-center font-serif text-slate-800 tracking-tight mb-4">Brasileiras<span className="text-emerald-600">emKL</span></h1>
         
         
          <p className="text-slate-600 mb-6 sm:mb-8 text-sm sm:text-base">Conhece uma brasileira que oferece um ótimo serviço? Preencha o formulário abaixo e enviaremos por e-mail!</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados da Pessoa que Indica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Seus Dados</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 text-sm sm:text-base">Seu Nome</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Digite seu nome completo"
                    className="text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 text-sm sm:text-base">Seu Telefone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Dados do Serviço Indicado */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Dados do Serviço</h3>

              <div className="space-y-2">
                <Label htmlFor="serviceName" className="text-slate-700 text-sm sm:text-base">Nome do Prestador de Serviço</Label>
                <Input
                  id="serviceName"
                  value={form.serviceName}
                  onChange={(e) => handleInputChange("serviceName", e.target.value)}
                  placeholder="Ex: Maria Limpeza, Joana Costura..."
                  className="text-sm sm:text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 text-sm sm:text-base">Descrição do Serviço</Label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Descreva o serviço oferecido, experiências, especialidades..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none h-32 text-sm sm:text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-700 text-sm sm:text-base">Endereço/Região de Atendimento</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Bairro, cidade ou região onde atende"
                  className="text-sm sm:text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneService" className="text-slate-700 text-sm sm:text-base">Telefone do Serviço</Label>
                <Input
                  id="phoneService"
                  value={form.phoneService}
                  onChange={(e) => handleInputChange("phoneService", e.target.value)}
                  placeholder="(19) 99999-9999"
                  className="text-sm sm:text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link" className="text-slate-700 text-sm sm:text-base">Website (opcional)</Label>
                <Input
                  id="link"
                  value={form.link}
                  onChange={(e) => handleInputChange("link", e.target.value)}
                  placeholder="https://exemplo.com.br"
                  className="text-sm sm:text-base"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base py-3"
              disabled={loading}
            >
              {loading ? "Enviando Indicação..." : "Enviar Indicação"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
