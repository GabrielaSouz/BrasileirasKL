"use client"

import { SearchCheck } from "lucide-react"

type Category = {
  id: string
  name: string
}

interface ServiceHeroProps {
  categories: Category[]
  search: string
  onSearchChange: (value: string) => void
  selectedCategory: string | null
  onCategoryChange: (id: string | null) => void
}

export default function ServiceHero({
  categories,
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: ServiceHeroProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Título */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif mb-6">
          Conectando <span className="text-emerald-600 italic">nossa comunidade</span>
        </h1>
        <p className="text-lg text-slate-600">
          Encontre contatos de confiança indicados por brasileiras
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl mx-auto">
        <SearchCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Ex: dentista"
          className="w-full pl-12 py-4 rounded-2xl shadow-lg"
        />
      </div>

      {/* Categorias */}
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-5 py-2 rounded-full text-sm cursor-pointer border ${
            !selectedCategory ? "bg-emerald-600 text-white font-semibold" : "bg-white"
          }`}
        >
          Todas
        </button>

        {Array.isArray(categories) && categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-5 py-2 rounded-full text-sm cursor-pointer border ${
              selectedCategory === cat.id
                ? "bg-emerald-600 text-white font-semibold"
                : "bg-white hover:border-emerald-600 "
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
