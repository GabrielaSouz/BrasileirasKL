import { NextResponse } from "next/server"
import { sql } from "@/lib/neon"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    // Verificar se usuário já existe
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 409 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar usuário
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `

    return NextResponse.json({ 
      success: true,
      message: "Usuário criado com sucesso"
    })

  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json({ 
      error: "Erro interno do servidor" 
    }, { status: 500 })
  }
}

