"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Input } from "@/components/ui/input"
import { SearchCheck, Plus, Edit, Trash2 } from "lucide-react"

export interface Category {
  id: string
  name: string
}

export interface Subcategory {
  id: string
  name: string
  category_id: string
  category_name: string
}

interface Props {
  categories: Category[]
  onCategoriesChange?: () => void
}

interface SubcategoryForm {
  name?: string
  category_id?: string
}

export default function SubcategoriesManager({ categories, onCategoriesChange }: Props) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [search, setSearch] = useState("")
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([])
  const [form, setForm] = useState<SubcategoryForm>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<string | null>(null)

  async function loadSubcategories() {
    try {
      const res = await fetch("/api/subcategories")
      const data = await res.json()
      setSubcategories(data)
    } catch (err) {
      console.error("Erro ao carregar subcategorias:", err)
      toast.error("Erro ao carregar subcategorias")
    }
  }

  useEffect(() => {
    loadSubcategories()
  }, [])

  useEffect(() => {
    const filtered = subcategories.filter(subcategory => 
      subcategory.name.toLowerCase().includes(search.toLowerCase()) ||
      subcategory.category_name.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredSubcategories(filtered)
  }, [subcategories, search])

  async function handleSubmit() {
    if (!form.name?.trim()) {
      toast.error("Informe o nome da subcategoria")
      return
    }

    if (!form.category_id) {
      toast.error("Selecione uma categoria")
      return
    }

    setLoading(true)
    try {
      const method = editingId ? "PUT" : "POST"
      const body = editingId ? { ...form, id: editingId } : form

      const res = await fetch("/api/subcategories", {
        method,
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Erro ao salvar subcategoria")
        return
      }

      setForm({})
      setEditingId(null)
      await loadSubcategories()

      toast.success(editingId ? "Subcategoria atualizada com sucesso!" : "Subcategoria criada com sucesso!")
    } catch (err) {
      console.error("Erro ao salvar subcategoria:", err)
      toast.error("Erro ao salvar subcategoria")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setSubcategoryToDelete(id)
    setDeleteDialogOpen(true)
  }

  async function confirmDelete() {
    if (!subcategoryToDelete) return

    setLoading(true)
    try {
      const res = await fetch("/api/subcategories", {
        method: "DELETE",
        body: JSON.stringify({ id: subcategoryToDelete }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Erro ao excluir subcategoria")
        return
      }

      await loadSubcategories()
      toast.success("Subcategoria excluída com sucesso!")
    } catch (err) {
      console.error("Erro ao deletar subcategoria:", err)
      toast.error("Erro ao excluir subcategoria")
    } finally {
      setLoading(false)
      setSubcategoryToDelete(null)
    }
  }

  function handleEdit(subcategory: Subcategory) {
    setEditingId(subcategory.id)
    setForm({
      name: subcategory.name,
      category_id: subcategory.category_id
    })
  }

  function handleCancel() {
    setEditingId(null)
    setForm({})
  }

  return (
    <div className="space-y-6">
      {/* FORM */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-slate-900">Adicionar/Editar Subcategoria</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Nome da subcategoria"
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
                Atualizar Subcategoria
              </Button>
            </>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              Salvar Subcategoria
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
            placeholder="Buscar subcategorias por nome ou categoria..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* LISTAGEM */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Subcategorias Cadastradas ({filteredSubcategories.length})
          </h2>
          {search && (
            <Button variant="outline" onClick={() => setSearch("")}>
              Limpar Filtro
            </Button>
          )}
        </div>

        {filteredSubcategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <SearchCheck className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-slate-600">
              {search ? "Nenhuma subcategoria encontrada para esta busca." : "Nenhuma subcategoria cadastrada ainda."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSubcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-emerald-500 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{subcategory.name}</h3>
                  <p className="text-sm text-slate-600">{subcategory.category_name}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(subcategory)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(subcategory.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Subcategoria"
        description="Tem certeza que deseja excluir esta subcategoria? Esta ação não pode ser desfeita."
        onConfirm={confirmDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
        loading={loading}
      />
    </div>
  )
}
