import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { sql } from "./neon"
import bcrypt from "bcryptjs"

const authConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("=== AUTHORIZE DEBUG ===")
        console.log("Email recebido:", credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Credenciais faltando")
          return null
        }

        try {
          const users = await sql`
            SELECT id, name, email, password
            FROM users 
            WHERE email = ${credentials.email}
          `

          console.log("Usuários encontrados:", users.length)
          const user = users[0]
          
          if (!user) {
            console.log("Usuário não encontrado no banco")
            return null
          }

          console.log("Comparando senhas...")
          const passwordMatch = await bcrypt.compare(credentials.password as string, user.password)
          
          if (!passwordMatch) {
            console.log("Senha não corresponde")
            return null
          }

          console.log("Login autorizado com sucesso!")
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        } catch (error) {
          console.error("Erro no authorize:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  events: {},
  adapter: undefined
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
export const authOptions = authConfig
