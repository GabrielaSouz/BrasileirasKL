import { NextResponse } from "next/server"
import { sql } from "@/lib/neon"

// LISTAR SERVIÇOS
export async function GET() {
  try {
    const data = await sql`
      SELECT 
        s.id,
        s.name,
        s.description,
        s.address,
        s.phone,
        s.link,
        s.category_id,
        c.name as category_name
      FROM services s
      LEFT JOIN categories c ON s.category_id = c.id
      ORDER BY s.created_at DESC
    `
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// CRIAR SERVIÇO
export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    await sql`
      INSERT INTO services (name, description, address, phone, link, category_id)
      VALUES (${body.name}, ${body.description}, ${body.address}, ${body.phone}, ${body.link}, ${body.category_id})
    `
    
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// EDITAR SERVIÇO
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    
    await sql`
      UPDATE services 
      SET name = ${body.name}, 
          description = ${body.description}, 
          address = ${body.address}, 
          phone = ${body.phone}, 
          link = ${body.link},
          category_id = ${body.category_id}
      WHERE id = ${body.id}
    `
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETAR SERVIÇO
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    
    await sql`DELETE FROM services WHERE id = ${id}`
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
