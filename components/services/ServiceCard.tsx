"use client"

import { MapPinIcon, PhoneIcon, Pencil, Trash2, Globe, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export type Service = {
  id: string
  name: string
  description: string
  address: string
  phone: string
  link?: string
  category_id: string
  categoryName: string
  subcategory_id?: string
  subcategoryName?: string
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
  const [expandedDescription, setExpandedDescription] = useState(false)
  const [expandedAddress, setExpandedAddress] = useState(false)

  const isLongDescription = service.description.length > 120
  const isLongAddress = service.address.length > 50

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
          {service.subcategoryName && (
            <span className="ml-1">• {service.subcategoryName}</span>
          )}
        </span>

        <h1 className="text-xl font-bold text-slate-900 line-clamp-2">
          {service.name}
        </h1>

        {/* Descrição com expandir/recolher */}
        <div className="text-slate-600 text-sm">
          {isLongDescription && !expandedDescription ? (
            <div>
              <p className="line-clamp-3">{service.description}</p>
              <button
                onClick={() => setExpandedDescription(true)}
                className="text-emerald-600 hover:text-emerald-700 text-xs font-medium mt-1 flex items-center gap-1"
              >
                <ChevronDown className="w-3 h-3" />
                Ler mais
              </button>
            </div>
          ) : (
            <div>
              <p className={expandedDescription ? "" : "line-clamp-4"}>
                {service.description}
              </p>
              {isLongDescription && expandedDescription && (
                <button
                  onClick={() => setExpandedDescription(false)}
                  className="text-emerald-600 hover:text-emerald-700 text-xs font-medium mt-1 flex items-center gap-1"
                >
                  <ChevronUp className="w-3 h-3" />
                  Ler menos
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
        {/* Endereço com expandir/recolher */}
        <div className="flex items-start text-sm text-slate-500">
          <MapPinIcon className="h-4 w-4 mr-2 text-emerald-500 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            {isLongAddress && !expandedAddress ? (
              <div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={expandedAddress ? "whitespace-normal text-slate-600 hover:text-slate-700 underline" : "line-clamp-1 text-slate-600 hover:text-slate-700 underline"}
                >
                  {service.address}
                </a>
                <button
                  onClick={() => setExpandedAddress(true)}
                  className="text-emerald-600 hover:text-emerald-700 text-xs font-medium mt-1 flex items-center gap-1"
                >
                  <ChevronDown className="w-3 h-3" />
                  Ver mais
                </button>
              </div>
            ) : (
              <div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={expandedAddress ? "whitespace-normal text-slate-600 hover:text-slate-700 underline" : "line-clamp-1 text-slate-600 hover:text-slate-700 underline"}
                >
                  {service.address}
                </a>
                {isLongAddress && expandedAddress && (
                  <button
                    onClick={() => setExpandedAddress(false)}
                    className="text-emerald-600 hover:text-emerald-700 text-xs font-medium mt-1 flex items-center gap-1"
                  >
                    <ChevronUp className="w-3 h-3" />
                    Recolher
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center text-sm text-slate-500 font-medium">
          <PhoneIcon className="h-4 w-4 mr-2 text-emerald-500" />
          <a 
            href={`tel:${service.phone}`}
            className="text-slate-600 hover:text-slate-700 underline"
          >
            {service.phone}
          </a>
        </div>

        {service.link && (
          <div className="flex items-center text-sm text-slate-500">
            <Globe className="h-4 w-4 mr-2 text-emerald-500" />
            <a 
              href={service.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-700 underline truncate"
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
