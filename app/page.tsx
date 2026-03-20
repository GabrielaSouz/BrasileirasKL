"use client"

import Header from "@/components/layout/Header";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceCard, { Service } from "@/components/services/ServiceCard";
import Footer from "@/components/layout/Footer";
import { useEffect, useState } from "react";
import { SearchCheck, Filter, ChevronDown } from "lucide-react";

type Category = {
  id: string
  name: string
  subcategories?: { id: string; name: string }[]
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.category-dropdown')) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isDropdownOpen])

  function loadServices() {
    fetch("/api/services")
      .then(res => res.json())
      .then((data: any[]) => {
        const servicesData = Array.isArray(data) ? data : []
        console.log("Services data bruto:", data)
        const formatted: Service[] = servicesData.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          address: s.address,
          phone: s.phone,
          link: s.link, // ✅ Adicionando o campo link
          category_id: s.category_id,
          categoryName: s.category_name || "Sem categoria",
          subcategory_id: s.subcategory_id,
          subcategoryName: s.subcategory_name
        }))
        console.log("Services formatados:", formatted)
        setServices(formatted)
      })
      .catch(error => {
        console.error('Erro ao carregar serviços:', error)
        setServices([])
      })
  }

  function loadCategories() {
    fetch("/api/categories")
      .then(res => res.json())
      .then((data: any[]) => {
        const categoriesData = Array.isArray(data) ? data : []
        console.log("Categorias carregadas:", categoriesData)
        setCategories(categoriesData)
      })
      .catch(error => {
        console.error('Erro ao carregar categorias:', error)
        setCategories([])
      })
  }
  useEffect(() => {
    loadCategories()
    loadServices()
  }, [])

  const filteredServices = services.filter(service => {
    const searchTerm = search.toLowerCase()
    
    const matchesSearch = service.name.toLowerCase().includes(searchTerm) ||
      service.description.toLowerCase().includes(searchTerm) ||
      service.categoryName.toLowerCase().includes(searchTerm) ||
      (service.subcategoryName && service.subcategoryName.toLowerCase().includes(searchTerm))
    
    const matchesCategory = !selectedCategory || service.category_id === selectedCategory
    const matchesSubcategory = !selectedSubcategory || service.subcategory_id === selectedSubcategory
    
    return matchesSearch && matchesCategory && matchesSubcategory
  })


  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="grow pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título e Search Lado a Lado */}
        <div className="mb-10 mt-6 md:mt-15 md:mb-15">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Título */}
            <div className="text-left lg:text-left lg:flex-1">
              <h1 className="text-4xl md:text-5xl font-serif mb-2">
                Conectando <span className="text-emerald-600 italic">nossa comunidade</span>
              </h1>
              <p className="text-lg text-slate-600">
                Encontre contatos de confiança indicados por brasileiras
              </p>
            </div>
            
            {/* Search */}
            <div className="lg:flex-1 lg:max-w-md w-full">
              <div className="relative">
                <SearchCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nome, descrição, categoria ou subcategoria..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl shadow-lg border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Layout Principal: Filtro Lateral + ServiceCards */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-slate-900">Filtrar por Categoria</h3>
              </div>
              
              {/* Dropdown de Categorias (Mobile) / Lista (Desktop) */}
              <div className="category-dropdown">
                {/* Mobile: Dropdown */}
                <div className="lg:hidden">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-medium text-slate-900">
                      {selectedCategory 
                        ? categories.find(cat => cat.id === selectedCategory)?.name
                        : selectedSubcategory 
                          ? categories.find(cat => cat.id === selectedCategory)?.subcategories?.find(sub => sub.id === selectedSubcategory)?.name
                          : "Todas as categorias"
                      }
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Content */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
                      {/* Opção Todas */}
                      <label className="flex items-center p-3 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100">
                        <input
                          type="radio"
                          name="category"
                          checked={!selectedCategory && !selectedSubcategory}
                          onChange={() => {
                            setSelectedCategory(null)
                            setSelectedSubcategory(null)
                            setIsDropdownOpen(false)
                          }}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="ml-3 font-medium text-slate-900">Todas as categorias</span>
                      </label>

                      {/* Categorias com subcategorias */}
                      {Array.isArray(categories) && categories.map(cat => (
                        <div key={cat.id}>
                          {/* Categoria principal */}
                          <label className="flex items-center p-3 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100">
                            <input
                              type="radio"
                              name="category"
                              checked={selectedCategory === cat.id && !selectedSubcategory}
                              onChange={() => {
                                setSelectedCategory(cat.id)
                                setSelectedSubcategory(null)
                                setIsDropdownOpen(false)
                              }}
                              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="ml-3 font-medium text-slate-900">{cat.name}</span>
                          </label>

                          {/* Subcategorias */}
                          {cat.subcategories && cat.subcategories.length > 0 && (
                            <div className="bg-slate-50">
                              {cat.subcategories.map(sub => (
                                <label 
                                  key={sub.id} 
                                  className="flex items-center p-3 pl-12 cursor-pointer hover:bg-slate-100 transition-colors border-b border-slate-100 last:border-b-0"
                                >
                                  <input
                                    type="radio"
                                    name="subcategory"
                                    checked={selectedSubcategory === sub.id}
                                    onChange={() => {
                                      setSelectedCategory(cat.id)
                                      setSelectedSubcategory(sub.id)
                                      setIsDropdownOpen(false)
                                    }}
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
                  )}
                </div>

                {/* Desktop: Lista Expandida */}
                <div className="hidden lg:block">
                  {/* Opção Todas */}
                  <label className="flex items-center p-2 cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="radio"
                      name="category"
                      checked={!selectedCategory && !selectedSubcategory}
                      onChange={() => {
                        setSelectedCategory(null)
                        setSelectedSubcategory(null)
                      }}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="ml-3 font-medium text-slate-900">Todas as categorias</span>
                  </label>

                  {/* Categorias com subcategorias */}
                  {Array.isArray(categories) && categories.map(cat => (
                    <div key={cat.id} className="mt-1">
                      {/* Categoria principal */}
                      <label className="flex items-center p-2 cursor-pointer hover:bg-slate-50 transition-colors">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat.id && !selectedSubcategory}
                          onChange={() => {
                            setSelectedCategory(cat.id)
                            setSelectedSubcategory(null)
                          }}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="ml-3 font-medium text-slate-900">{cat.name}</span>
                      </label>

                      {/* Subcategorias */}
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="ml-4 mt-1">
                          {cat.subcategories.map(sub => (
                            <label 
                              key={sub.id} 
                              className="flex items-center p-2 cursor-pointer hover:bg-slate-50 transition-colors"
                            >
                              <input
                                type="radio"
                                name="subcategory"
                                checked={selectedSubcategory === sub.id}
                                onChange={() => {
                                  setSelectedCategory(cat.id)
                                  setSelectedSubcategory(sub.id)
                                }}
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
                        setSelectedCategory(null)
                        setSelectedSubcategory(null)
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

          {/* Conteúdo dos ServiceCards */}
          <div className="flex-1 mb-15">
            <div id="services-section" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-stretch gap-6">
              {Array.isArray(filteredServices) && filteredServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
            
            {/* Mensagem quando não há serviços */}
            {Array.isArray(filteredServices) && filteredServices.length === 0 && (
              <div className="text-center py-12">
                <div className="text-slate-400 mb-4">
                  <SearchCheck className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-slate-600">
                  {search || selectedCategory || selectedSubcategory 
                    ? "Nenhum serviço encontrado para esta busca." 
                    : "Nenhum serviço cadastrado ainda."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
