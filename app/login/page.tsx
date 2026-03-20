"use client"

import Link from "next/link";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    
   async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // vamos controlar manualmente
      })

      console.log("Login result:", result)

      if (result?.error) {
        toast.error("Email ou senha inválidos")
        setLoading(false)
        return
      }

      if (result?.ok) {
        toast.success("Login realizado com sucesso!")
        router.push("/admin")
        router.refresh()
      } else {
        toast.error("Erro ao fazer login")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

    return(
        <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-md w-full max-w-md">
              
              {/* Imagem acima do título */}
        <Image
          src="/background-login.jpg"
          alt="Login"
          width={500}
          height={500}
          className="mx-auto w-full h-48 object-cover mb-2 rounded-t-lg"
        />
           <div className="p-8">
             <h1 className="text-3xl text-slate-6000 mb-4 text-center font-serif">
             Bem-vinda de <span className="text-emerald-600 italic">volta!</span>
           </h1>

        {/* Links */}
           <div className="flex justify-around items-center text-slate-600 text-sm mb-6">
            <Link href="/login" className="font-semibold text-emerald-600">Login</Link>
            <span className="text-emerald-600 font-bold text-base  hover:text-emerald-600 transition-colors">|</span>
            <Link href="/register" className=" hover:text-emerald-600 transition-colors">Cadastro</Link>
             <span className="text-emerald-600 font-bold text-base  hover:text-emerald-600 transition-colors">|</span>
            <Link href="/" className=" hover:text-emerald-600 transition-colors">Página Inicial</Link>
           </div>

           {/* Form */}
           <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1">
            <Label htmlFor="email" className="text-slate-800">Email</Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" className="text-sm"/>
           </div>

           <div className="space-y-1">
            <Label htmlFor="password" className="text-slate-800">Senha</Label>
            <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your password" className="text-sm"/>
           </div>

        <Button type="submit" className="w-full mt-4" disabled={loading}>{loading ? "Loading..." : "Login"}</Button>
           
           </form>
           </div>
           </div>
        </div>
    )
}