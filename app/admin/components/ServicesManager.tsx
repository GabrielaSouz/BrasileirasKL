"use client"

import { useEffect, useState } from "react"
import ServiceCard, { Service } from "@/components/services/ServiceCard"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Input } from "@/components/ui/input"
import { SearchCheck } from "lucide-react"

export interface Category {
  id: string
  name: string
}

interface Props {
  categories: Category[]
  onCategoriesChange?: () => void // opcional para atualizar categorias quando necessário
  globalSearch?: string // search global da AdminPage
}

interface ServiceForm {
  name?: string
  description?: string
  address?: string
  phone?: string
  link?: string
  category_id?: string
}

export default function ServicesManager({ categories, onCategoriesChange, globalSearch }: Props) {
  const [services, setServices] = useState<Service[]>([])
  const [search, setSearch] = useState("")
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [form, setForm] = useState<ServiceForm>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)

  async function loadServices() {
    try {
      const res = await fetch("/api/services")
      const data = await res.json()
      const formatted: Service[] = data.map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        address: s.address,
        phone: s.phone,
        link: s.link,
        category_id: s.category_id,
        categoryName: s.categories?.name || "Sem categoria",
      }))
      setServices(formatted)
    } catch (err) {
      console.error("Erro ao carregar serviços:", err)
      toast.error("Erro ao carregar serviços")
    }
  }

  useEffect(() => {
    loadServices()
  }, [])

  useEffect(() => {
    const filtered = services.filter(service => 
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase()) ||
      service.address.toLowerCase().includes(search.toLowerCase()) ||
      service.categoryName.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredServices(filtered)
  }, [services, search, globalSearch])

  // Sincroniza search local com globalSearch
  useEffect(() => {
    if (globalSearch !== undefined) {
      setSearch(globalSearch)
    }
  }, [globalSearch])

  async function handleSubmit() {
    if (!form.name?.trim()) {
      toast.error("Informe o nome do serviço")
      return
    }

    setLoading(true)
    try {
      const method = editingId ? "PUT" : "POST"
      const body = editingId ? { ...form, id: editingId } : form

      const res = await fetch("/api/services", {
        method,
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Erro ao salvar serviço")
        return
      }

      setForm({})
      setEditingId(null)
      await loadServices()
      if (onCategoriesChange) onCategoriesChange()

      toast.success(editingId ? "Serviço atualizado com sucesso!" : "Serviço criado com sucesso!")
    } catch (err) {
      console.error("Erro ao salvar serviço:", err)
      toast.error("Erro ao salvar serviço")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setServiceToDelete(id)
    setDeleteDialogOpen(true)
  }

  async function confirmDelete() {
    if (!serviceToDelete) return

    setLoading(true)
    try {
      const res = await fetch("/api/services", {
        method: "DELETE",
        body: JSON.stringify({ id: serviceToDelete }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Erro ao excluir serviço")
        return
      }

      await loadServices()
      toast.success("Serviço excluído com sucesso!")
    } catch (err) {
      console.error("Erro ao deletar serviço:", err)
      toast.error("Erro ao excluir serviço")
    } finally {
      setLoading(false)
      setServiceToDelete(null)
    }
  }

  function handleEdit(service: Service) {
    setEditingId(service.id)
    setForm(service)
  }

  function handleCancel() {
    setEditingId(null)
    setForm({})
  }

  return (
    <div className="space-y-6">
      {/* FORM */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-slate-900">Adicionar/Editar Serviço</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Nome do serviço"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={loading}
          />

          <select
            className="border border-slate-300 rounded-md p-2 w-full focus:border-emerald-500 focus:outline-none"
            value={form.category_id || ""}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            disabled={loading}
          >
            <option value="">Selecione a categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <textarea
          className="w-full mt-4 border border-slate-300 rounded-md p-2 focus:border-emerald-500 focus:outline-none resize-none"
          rows={3}
          placeholder="Descrição do serviço"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          disabled={loading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input
            placeholder="Endereço"
            value={form.address || ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            disabled={loading}
          />
          <Input
            placeholder="Telefone"
            value={form.phone || ""}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="mt-4">
          <Input
            placeholder="Link do website (opcional)"
            value={form.link || ""}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="flex gap-3 mt-6">
          {editingId ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1"
              >
                Atualizar Serviço
              </Button>
            </>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              Salvar Serviço
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="relative">
          <SearchCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar serviços por nome, descrição, endereço ou categoria..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* LISTAGEM */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Serviços Cadastrados ({filteredServices.length})
          </h2>
          {search && (
            <Button variant="outline" onClick={() => setSearch("")}>
              Limpar Filtro
            </Button>
          )}
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <SearchCheck className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-slate-600">
              {search ? "Nenhum serviço encontrado para esta busca." : "Nenhum serviço cadastrado ainda."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                variant="admin"
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Serviço"
        description="Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita."
        onConfirm={confirmDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
        loading={loading}
      />
    </div>
  )
}
