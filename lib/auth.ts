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
        console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL)
        console.log("NODE_ENV:", process.env.NODE_ENV)
        console.log("NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET)
        console.log("VERCEL_ENV:", process.env.VERCEL_ENV)
        
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
          console.log("Retornando user object:", {
            id: user.id,
            name: user.name,
            email: user.email,
          })
          
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
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24 horas
  },
  callbacks: {
    async jwt({ token, user }: any) {
      console.log("=== JWT CALLBACK ===")
      console.log("Token antes:", token)
      console.log("User no callback:", user)
      
      if (user) {
        token.id = user.id
        console.log("Token com user.id:", token)
      }
      
      console.log("Token depois:", token)
      return token
    },
    async session({ session, token }: any) {
      console.log("=== SESSION CALLBACK ===")
      console.log("Session antes:", session)
      console.log("Token no session callback:", token)
      
      if (token) {
        session.user.id = token.id as string
        console.log("Session com token.id:", session)
      }
      
      console.log("Session depois:", session)
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  events: {
    async signIn(message: any) {
      console.log("=== SIGN IN EVENT ===")
      console.log("User:", message.user)
      console.log("Account:", message.account)
    }
  },
  adapter: undefined,
  trustHost: true, // Forçado para Vercel
  useSecureCookies: false, // Forçado false para testar
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
export const authOptions = authConfig
