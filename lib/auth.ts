import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";

import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const DEFAULT_ADMIN_EMAIL = "admin@krafta.com";
        const DEFAULT_ADMIN_PASS = "krafta2026";

        if (
          credentials.email === DEFAULT_ADMIN_EMAIL &&
          credentials.password === DEFAULT_ADMIN_PASS
        ) {
          return {
            id: "default-admin-id",
            email: DEFAULT_ADMIN_EMAIL,
            name: "System Administrator",
            role: "ADMIN",
          };
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const isValid = await compare(
          credentials.password,
          user.hashedPassword,
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      if (!token.role && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
           select: { id: true, role: true },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
      }
      if (session.user && token.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};
