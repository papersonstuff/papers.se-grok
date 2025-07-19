import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { SupabaseAdapter } from '@auth/supabase-adapter';

export const authOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,  // 'smtp.gmail.com'
        port: process.env.EMAIL_SERVER_PORT,  // '587'
        auth: {
          user: process.env.EMAIL_SERVER_USER,  // 'info@papers.se'
          pass: process.env.EMAIL_SERVER_PASSWORD,  // 'U9=(AOd.wu>&0bd4'
        },
      },
      from: process.env.EMAIL_FROM,  // 'info@papers.se'
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET,
  pages: {
    signIn: '/auth/signin',  // Your custom sign-in page
    error: '/auth/error',  // Your custom error page
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;  // Add user ID for subscription checks
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
