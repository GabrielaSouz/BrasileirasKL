"use client"

import Header from "@/components/layout/Header";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceCard, { Service } from "@/components/services/ServiceCard";
import Footer from "@/components/layout/Footer";
import { useEffect, useState } from "react";

type Category = {
  id: string
  name: string
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  function loadServices() {
    fetch("/api/services")
      .then(res => res.json())
      .then((data: any[]) => {
        const servicesData = Array.isArray(data) ? data : []
        const formatted: Service[] = servicesData.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          address: s.address,
          phone: s.phone,
          category_id: s.category_id,
          categoryName: s.categories?.name || "Sem categoria",
        }))
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
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || service.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })


  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="grow pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ServiceHero categories={categories}
          search={search}
          onSearchChange={setSearch}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <div id="services-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch gap-6 mb-12">
          {Array.isArray(filteredServices) && filteredServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
