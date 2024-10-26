import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import  pclient from "db/prisma";
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    username: string;
  }
  interface Session {
    user: {
    id: string;
    username: string;
    } & DefaultSession['user'];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "Credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize (credentials: any): Promise<any>{
        try {
          const user = await pclient.user.findUnique({
            where: {
              username: credentials.username,
            },
          });
          if (!user) {
            throw new Error("User not found");
          }
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          if (!passwordMatch) {
            throw new Error("Invalid password");
          }
          return user;
        } catch (error) {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if(token){
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id.toString();
        token.username = user.username.toString();
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};


