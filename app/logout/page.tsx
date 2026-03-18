"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { toast } from "sonner"

export default function Logout() {
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut({ redirect: false })
        toast.success("Logout realizado com sucesso!")
        router.push("/")
      } catch (error) {
        console.error("Erro no logout:", error)
        toast.error("Erro ao fazer logout")
        router.push("/")
      }
    }

    performLogout()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Saindo...</p>
      </div>
    </div>
  )
}
