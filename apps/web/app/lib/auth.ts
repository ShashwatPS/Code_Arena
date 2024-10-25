import { db } from "../db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import type { NextAuthOptions, User } from "next-auth";
import { JWTPayload, SignJWT, importJWK } from "jose";

declare module "next-auth" {
    interface Session {
        user: {
            token: string;
        } & User;
    }
    interface User {
        token: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        idToken?: string;
        token?: string;
        id?: string;
    }
}

// Function to generate a JWT
const generateJWT = async (payload: JWTPayload) => {
    const secret = process.env.JWT_SECRET || "secret";
    const jwk = await importJWK({ k: secret, alg: "HS256", kty: "oct" });
    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("365d")
        .sign(jwk);
    return jwt;
};

// NextAuth options with credentials provider
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Email", type: "text", placeholder: "name@gmail.com" },
                password: { label: "Password", type: "password", placeholder: "********" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials.password) {
                    throw new Error("Username and password are required");
                }

                const user = await db.user.upsert({
                    where: { email: credentials.username },
                    update: {},
                    create: {
                        email: credentials.username,
                        name: credentials.username,
                        password: await bcrypt.hash(credentials.password, 10),
                    },
                });

                const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                if (!isValidPassword) return null;

                const token = await generateJWT({ id: user.id });

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token,
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET || "secr3t",
    session: {
        strategy: "jwt",
    },
    callbacks: {
        session: async ({ session, token }) => {
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.token = token.token as string;
            }
            return session;
        },
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
                token.token = user.token;
            }
            return token;
        },
    },
};
