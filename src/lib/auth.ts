import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const { prisma } = await import("./prisma")

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null

        const isValid = await bcrypt.compare(password, user.hashedPassword)
        if (!isValid) return null

        return { id: user.id, name: user.name, email: user.email, role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role as string
      }
      return session
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      const isOnAdminPages = nextUrl.pathname.startsWith("/admins")
      const isOnPdfUpload = nextUrl.pathname.startsWith("/pdfs/upload")
      const isOnLogin = nextUrl.pathname.startsWith("/login")

      if (isOnLogin) {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl))
        return true
      }

      if (isOnDashboard || isOnPdfUpload) {
        if (!isLoggedIn) return Response.redirect(new URL("/login", nextUrl))
        return true
      }

      if (isOnAdminPages) {
        if (!isLoggedIn) return Response.redirect(new URL("/login", nextUrl))
        const role = (auth?.user as any)?.role
        if (role !== "admin") return Response.redirect(new URL("/dashboard", nextUrl))
        return true
      }

      return true
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
})
