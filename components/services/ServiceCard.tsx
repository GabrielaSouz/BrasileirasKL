"use client"

import { MapPinIcon, PhoneIcon, Pencil, Trash2, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Service = {
  id: string
  name: string
  description: string
  address: string
  phone: string
  link?: string
  category_id: string
  categoryName: string
}

interface ServiceCardProps {
  service: Service
  variant?: "default" | "admin"
  onEdit?: (service: Service) => void
  onDelete?: (id: string) => void
}

export default function ServiceCard({
  service,
  variant = "default",
  onEdit,
  onDelete,
}: ServiceCardProps) {
  return (
    <div className="
      bg-white rounded-lg p-6
      shadow-sm border border-slate-100
      hover:shadow-xl transition-shadow duration-300
      min-h-[220px] flex flex-col
    ">
      {/* Conteúdo */}
      <div className="space-y-2">
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full uppercase tracking-wider">
          {service.categoryName}
        </span>

        <h1 className="text-xl font-bold text-slate-900 line-clamp-2">
          {service.name}
        </h1>

        <p className="text-slate-600 text-sm line-clamp-4">
          {service.description}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center text-sm text-slate-500">
          <MapPinIcon className="h-4 w-4 mr-2 text-emerald-500" />
          <p className="line-clamp-1">{service.address}</p>
        </div>

        <div className="flex items-center text-sm text-slate-500 font-medium">
          <PhoneIcon className="h-4 w-4 mr-2 text-emerald-500" />
          <p>{service.phone}</p>
        </div>

        {service.link && (
          <div className="flex items-center text-sm text-slate-500">
            <Globe className="h-4 w-4 mr-2 text-emerald-500" />
            <a 
              href={service.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700 underline truncate"
            >
              Website
            </a>
          </div>
        )}

        {/* Ações admin */}
        {variant === "admin" && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(service)}
              className="flex-1"
            >
              <Pencil size={16} className="mr-2" />
              Editar
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete?.(service.id)}
              className="flex-1"
            >
              <Trash2 size={16} className="mr-2" />
              Excluir
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
