import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";
import type { NextAuthConfig } from "next-auth";

// Aqui se hacen las configuraciones necesarias
// Aca se manejan proveedores, como github, google al momento de hacer login,
// pero como veremos usuarios autenticados en nuestra BD, esto no sera necesario
// Por que ya hize la pagina de registro.

interface resultadoRow extends RowDataPacket {
    resultado: string // Para que lo arrojado por mi stored tenga un tipo de dato
}

const authOptions: NextAuthConfig = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email@gmail.com" },
                password: { label: "Password", type: "password", placeholder: "******" }
            },
            //credentials agarra el email y el password colocados
            async authorize(credentials, req) {
                console.log(credentials);
                const [rows] = await db.query<resultadoRow[]>(
                    "CALL authUser(?,?)",
                    [credentials?.email, credentials?.password])
                const resultadoJSON = rows[0][0]?.resultado;
                // Si ya es objeto, úsalo tal cual
                const data = typeof resultadoJSON === "string"
                    ? JSON.parse(resultadoJSON)
                    : resultadoJSON ?? [];

                if (data.ok) {
                    return {
                        id: data.usuario.id,
                        name: data.usuario.nombre,
                        email: data.usuario.email,
                        surname: data.usuario.apellido,
                        phone: data.usuario.telefono,
                        typeDocument: data.usuario.tipo_identificacion,
                        documentId: data.usuario.identificacion
                    };
                } else {
                    return null; // no autorizado
                }

            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;

                // ⚠️ Aquí usamos "as any" para acceder a campos extra
                token.surname = (user as any).surname;
                token.phone = (user as any).phone;
                token.typeDocument = (user as any).typeDocument;
                token.documentId = (user as any).documentId;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.surname = token.surname as string;
                session.user.phone = token.phone as string;
                session.user.typeDocument = token.typeDocument as string;
                session.user.documentId = token.documentId as string;
            }
            return session;
        }
    }
}


//esto nos arroja una funcion, geneerlmente un handler
const { handlers: { GET, POST }, auth } = NextAuth(authOptions);
//depende de que necesitamos se llamaria a la funcion
export { GET, POST, auth };
