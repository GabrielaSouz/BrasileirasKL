"use client"

import { SearchCheck, ChevronDown, Filter } from "lucide-react"
import { useState } from "react"

type Category = {
  id: string
  name: string
  subcategories?: { id: string; name: string }[]
}

interface ServiceHeroProps {
  categories: Category[]
  search: string
  onSearchChange: (value: string) => void
  selectedCategory: string | null
  onCategoryChange: (id: string | null) => void
  selectedSubcategory: string | null
  onSubcategoryChange: (id: string | null) => void
}

export default function ServiceHero({
  categories,
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSubcategory,
  onSubcategoryChange,
}: ServiceHeroProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      // Se já está selecionado, desmarca
      onCategoryChange(null)
      onSubcategoryChange(null)
      setExpandedCategory(null)
    } else {
      // Seleciona a categoria
      onCategoryChange(categoryId)
      onSubcategoryChange(null)
      setExpandedCategory(categoryId)
    }
  }

  const handleSubcategoryClick = (subcategoryId: string) => {
    if (selectedSubcategory === subcategoryId) {
      // Se já está selecionado, desmarca
      onSubcategoryChange(null)
    } else {
      // Seleciona a subcategoria
      onSubcategoryChange(subcategoryId)
    }
  }

  return (
    <>
      {/* Título e Search */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-serif mb-6">
          Conectando <span className="text-emerald-600 italic">nossa comunidade</span>
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Encontre contatos de confiança indicados por brasileiras
        </p>
        
        {/* Search */}
        <div className="relative max-w-2xl mx-auto">
          <SearchCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Ex: dentista, cabeleireira, pediatra..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl shadow-lg border border-slate-200 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Layout Principal: Filtro Lateral + Conteúdo */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de Filtros */}
        <aside className="lg:w-80 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-slate-900">Filtrar por Categoria</h3>
            </div>
            
            <div className="space-y-2">
              {/* Opção Todas */}
              <label className="flex items-center p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="radio"
                  name="category"
                  checked={!selectedCategory}
                  onChange={() => {
                    onCategoryChange(null)
                    onSubcategoryChange(null)
                    setExpandedCategory(null)
                  }}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-3 font-medium text-slate-900">Todas as categorias</span>
              </label>

              {/* Categorias com subcategorias */}
              {Array.isArray(categories) && categories.map(cat => (
                <div key={cat.id} className="border border-slate-200 rounded-lg overflow-hidden">
                  {/* Categoria principal */}
                  <label className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.id && !selectedSubcategory}
                        onChange={() => handleCategoryClick(cat.id)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="ml-3 font-medium text-slate-900">{cat.name}</span>
                    </div>
                    
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <ChevronDown 
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          expandedCategory === cat.id ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </label>

                  {/* Subcategorias (expansível) */}
                  {cat.subcategories && cat.subcategories.length > 0 && expandedCategory === cat.id && (
                    <div className="border-t border-slate-200 bg-slate-50">
                      {cat.subcategories.map(sub => (
                        <label 
                          key={sub.id} 
                          className="flex items-center p-3 pl-12 cursor-pointer hover:bg-slate-100 transition-colors border-b border-slate-100 last:border-b-0"
                        >
                          <input
                            type="radio"
                            name="subcategory"
                            checked={selectedSubcategory === sub.id}
                            onChange={() => handleSubcategoryClick(sub.id)}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="ml-3 text-sm text-slate-700">{sub.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Filtros selecionados */}
            {(selectedCategory || selectedSubcategory) && (
              <div className="mt-6 p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-emerald-700">
                    Filtrando por: {
                      selectedSubcategory 
                        ? categories.find(cat => cat.id === selectedCategory)?.subcategories?.find(sub => sub.id === selectedSubcategory)?.name
                        : categories.find(cat => cat.id === selectedCategory)?.name
                    }
                  </span>
                  <button
                    onClick={() => {
                      onCategoryChange(null)
                      onSubcategoryChange(null)
                      setExpandedCategory(null)
                    }}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Limpar
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Espaço para os ServiceCards - será preenchido pela página principal */}
        <div className="flex-1">
          {/* Conteúdo será injetado aqui pela página principal */}
        </div>
      </div>
    </>
  )
}
