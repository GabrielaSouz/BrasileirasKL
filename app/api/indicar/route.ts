import { Resend } from "resend"
import { NextResponse } from "next/server"

// Só inicializa o Resend se a chave existir
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req: Request) {
  try {
    const data = await req.json()

    // Se não tiver API key, apenas salva os dados (não envia email)
    if (!resend) {
      console.log("RESEND_API_KEY não configurada - dados recebidos:", data)
      return NextResponse.json({ 
        success: true, 
        message: "Indicação recebida (email não configurado)" 
      })
    }

    await resend.emails.send({
      from: "Brasileiras em KL - Indicações <onboarding@resend.dev>",
      to: ["souza.gab@hotmail.com"],
      subject: "Nova Indicação de Serviço - Brasileiras em KL",
      text: `
NOVA INDICAÇÃO DE SERVIÇO

=== QUEM INDICOU ===
Nome: ${data.name}
Telefone: ${data.phone}

=== SERVIÇO ===
Nome: ${data.serviceName}
Descrição: ${data.description}
Endereço: ${data.address}
Telefone: ${data.phoneService}
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao enviar e-mail" },
      { status: 500 }
    )
  }
}
