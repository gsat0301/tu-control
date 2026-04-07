import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isAdmin = auth?.user?.role === 'admin';

      if (isOnAdmin) {
        if (isLoggedIn && isAdmin) return true;
        return false;
      }

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      }

      if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isPremium = user.isPremium;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isPremium = token.isPremium as boolean;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
