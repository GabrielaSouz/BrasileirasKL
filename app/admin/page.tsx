"use client"

import { useEffect, useState } from "react"
import { BarChart3, Users, Settings, Database, Search, Plus, HeartIcon, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CategoriesManager from "./components/CategoriesManager"
import ServicesManager from "./components/ServicesManager"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

type Category = {
  id: string
  name: string
}

type TabType = "overview" | "services" | "categories"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [search, setSearch] = useState("")
  const [stats, setStats] = useState({
    totalServices: 0,
    totalCategories: 0,
    recentServices: 0
  })

  useEffect(() => {
    if (status === "loading") return // Ainda carregando
    
    if (!session) {
      router.push("/login")
      return
    }

    // Só carrega os dados se estiver autenticado
    loadCategories()
    loadStats()
  }, [session, status, router])

  function loadCategories() {
    fetch("/api/categories")
      .then(res => res.json())
      .then(setCategories)
  }

  function loadStats() {
    Promise.all([
      fetch("/api/services").then(res => res.json()),
      fetch("/api/categories").then(res => res.json())
    ]).then(([services, categories]) => {
      setStats({
        totalServices: services.length,
        totalCategories: categories.length,
        recentServices: services.slice(-5).length
      })
    })
  }

  const tabs = [
    { id: "overview", label: "Visão Geral", icon: BarChart3 },
    { id: "services", label: "Serviços", icon: Users },
    { id: "categories", label: "Categorias", icon: Database }
  ] as const

  // Mostrar loading enquanto verifica autenticação
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Redirecionar se não estiver autenticado
  if (!session) {
    return null // O useEffect vai redirecionar
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Painel Administrativo</h1>
              <p className="text-slate-600 mt-1">Gerencie serviços e categorias da plataforma</p>
            </div>

            <div>
              <Link href="/" className="flex items-center space-x-2">
              <div className="flex justify-center items-center bg-emerald-600 p-1.5 rounded-lg hover:bg-emerald-500 transition-colors">
                <HeartIcon className="h-6 w-6 text-white " />
              </div>
              <h1 className="text-base md:text-xl font-serif text-slate-800 tracking-tight">Brasileiras<span className="text-emerald-600">emKL</span></h1>
            </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 mt-6 bg-slate-100 p-1 rounded-lg w-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total de Serviços</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalServices}</p>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total de Categorias</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalCategories}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Adições Recentes</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.recentServices}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Ações Rápidas</h2>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setActiveTab("services")} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Serviço
                </Button>
                <Button onClick={() => setActiveTab("categories")} variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Categoria
                </Button>
              </div>
            </div>

          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <ServicesManager categories={categories} globalSearch={search} />
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <CategoriesManager onChange={loadCategories} globalSearch={search} />
        )}
      </div>
    </div>
  )
}
