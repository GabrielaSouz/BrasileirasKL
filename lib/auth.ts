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
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const users = await sql`
            SELECT id, name, email, password
            FROM users 
            WHERE email = ${credentials.email}
          `

          const user = users[0]
          
          if (!user) {
            return null
          }

          const passwordMatch = await bcrypt.compare(credentials.password as string, user.password)
          
          if (!passwordMatch) {
            return null
          }
          
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
  trustHost: true, // Importante para Vercel
  useSecureCookies: false, // Chave para funcionar no Vercel
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
export const authOptions = authConfig
