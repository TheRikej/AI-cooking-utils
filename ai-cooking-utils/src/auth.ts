import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { users } from "./db/schema/users";

export const authOptions = {
  providers: [GitHub],
  adapter: DrizzleAdapter(db),

  callbacks: {
    session: async ({ session, token }) => {
      if (!session.user || !token.sub) return session;

      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
      });

      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.name = dbUser.name;
        session.user.image = dbUser.image;
      }
      return session;
    },

    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    authorized: ({ auth, request: { nextUrl } }) => {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith("/protected");

      if (!isLoggedIn && isProtected) {
        const redirectUrl = new URL("/api/auth/signin", nextUrl.origin);
        redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
        return Response.redirect(redirectUrl);
      }

      return true;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Session expiration time (30 days)
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signOut } = NextAuth(authOptions);
