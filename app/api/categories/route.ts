import { NextResponse } from "next/server"
import { sql } from "@/lib/neon"


//Listar Categorias com subcategorias
export async function GET() {
  try {
    const categories = await sql`
      SELECT id, name 
      FROM categories 
      ORDER BY name ASC
    `
    
    // Buscar subcategorias para cada categoria
    const categoriesWithSubs = await Promise.all(
      categories.map(async (category: any) => {
        const subcategories = await sql`
          SELECT id, name 
          FROM subcategories 
          WHERE category_id = ${category.id}
          ORDER BY name ASC
        `
        
        return {
          ...category,
          subcategories: subcategories
        }
      })
    )
    
    return NextResponse.json(categoriesWithSubs)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

//Criar Categoria
export async function POST(req: Request) {
  try {
    const { name } = await req.json()
    
    await sql`INSERT INTO categories (name) VALUES (${name})`
    
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Categoria já existe" },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


//Editar Categoria
export async function PUT(req: Request) {
  try {
    const { id, name } = await req.json()
    
    await sql`
      UPDATE categories 
      SET name = ${name} 
      WHERE id = ${id}
    `
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Já existe uma categoria com esse nome" },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

//Deletar Categoria
export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    
    await sql`DELETE FROM categories WHERE id = ${body.id}`
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
