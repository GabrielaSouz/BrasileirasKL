import { NextResponse } from "next/server"
import { sql } from "@/lib/neon"

// Listar subcategorias (opcionalmente filtradas por categoria)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('category_id')
    
    let query = `
      SELECT s.id, s.name, s.category_id, c.name as category_name
      FROM subcategories s
      LEFT JOIN categories c ON s.category_id = c.id
    `
    
    if (categoryId) {
      query += ` WHERE s.category_id = ${categoryId}`
    }
    
    query += ` ORDER BY s.name ASC`
    
    const data = await sql(query)
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Criar subcategoria
export async function POST(req: Request) {
  try {
    const { name, category_id } = await req.json()
    
    if (!name || !category_id) {
      return NextResponse.json(
        { error: "Nome e ID da categoria são obrigatórios" },
        { status: 400 }
      )
    }
    
    // Verificar se categoria existe
    const categoryExists = await sql`
      SELECT id FROM categories WHERE id = ${category_id}
    `
    
    if (categoryExists.length === 0) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      )
    }
    
    await sql`
      INSERT INTO subcategories (name, category_id) 
      VALUES (${name}, ${category_id})
    `
    
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Subcategoria já existe para esta categoria" },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Editar subcategoria
export async function PUT(req: Request) {
  try {
    const { id, name, category_id } = await req.json()
    
    if (!id || !name || !category_id) {
      return NextResponse.json(
        { error: "ID, nome e ID da categoria são obrigatórios" },
        { status: 400 }
      )
    }
    
    await sql`
      UPDATE subcategories 
      SET name = ${name}, category_id = ${category_id}
      WHERE id = ${id}
    `
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Subcategoria já existe para esta categoria" },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Deletar subcategoria
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    
    if (!id) {
      return NextResponse.json(
        { error: "ID da subcategoria é obrigatório" },
        { status: 400 }
      )
    }
    
    await sql`DELETE FROM subcategories WHERE id = ${id}`
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
