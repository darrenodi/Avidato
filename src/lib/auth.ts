import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { sendWelcomeEmail } from "./email-service"

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt' as const, // Changed from database to jwt for better reliability
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: false, // Clean production configuration
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Host-' : ''}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent select_account",
          access_type: "offline",
          response_type: "code"
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      }
    }),
    CredentialsProvider({
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
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user: any }) {
      // When user signs in, add essential user data to token
      if (user) {
        token.id = user.id
        token.username = user.username
        token.isAdmin = user.isAdmin || false
      } else if (token.sub) {
        // On refresh, fetch latest user data from database to get isAdmin
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { isAdmin: true }
          })
          if (dbUser) {
            token.isAdmin = dbUser.isAdmin
          }
        } catch (error) {
          console.error('Failed to fetch isAdmin from database in JWT:', error)
        }
      }
      
      return token
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      // Send essential user data from token to session
      if (token && session.user) {
        session.user.id = token.id
        session.user.username = token.username
        session.user.isAdmin = token.isAdmin || false
        // Note: emailVerified NOT in session - fetch from DB when needed in settings/features
      }
      
      return session
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user, account, profile, isNewUser }: any): Promise<boolean> {
      // Fetch fresh user data from database to include isAdmin
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, isAdmin: true, emailVerified: true }
        })
        
        if (dbUser) {
          user.isAdmin = dbUser.isAdmin
        }
      } catch (error) {
        console.error('Failed to fetch user data in signIn:', error)
      }
      
      if (account?.provider === "google" && profile && user.email) {
        // Prevent account switching by using profile data
        user.email = profile.email
        user.name = profile.name
        user.image = profile.picture || user.image
        
        // Auto-verify email for ALL Google users (even existing ones)
        // Google's email verification is built-in, so we can trust it
        try {
          const updatedUser = await prisma.user.update({
            where: { email: user.email },
            data: { emailVerified: new Date() }
          })
          user.emailVerified = updatedUser.emailVerified
          user.isAdmin = updatedUser.isAdmin
          
          // Send welcome email to new Google users only
          if (isNewUser) {
            try {
              await sendWelcomeEmail(user.email, user.name)
            } catch (welcomeError) {
              console.error('Failed to send welcome email to Google user:', welcomeError)
              // Don't fail signin if welcome email fails
            }
          }
        } catch (error) {
          console.error('Failed to auto-verify Google user email:', error)
        }
      }
      
      return true
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async redirect({ url, baseUrl, user }: { url: string; baseUrl: string; user?: any }) {
      // Redirect admins to admin dashboard after login
      if (user?.isAdmin && url.includes('/login')) {
        // On localhost, use /admin path; in production, use admin subdomain
        const isProduction = baseUrl.includes('avidato.com') && !baseUrl.includes('localhost')
        return isProduction ? 'http://admin.avidato.com/dashboard' : `${baseUrl}/admin`
      }
      
      if (url.includes('/login?callbackUrl=')) {
        const callbackUrl = new URL(url).searchParams.get('callbackUrl')
        if (callbackUrl) {
          return `${baseUrl}${callbackUrl}`
        }
      }
      
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      
      if (url.startsWith(baseUrl)) {
        return url
      }
      
      return `${baseUrl}/dashboard`
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}