import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// Importa la función de autenticación
// import { auth } from "@/app/api/auth/[...nextauth]/route";
// Muy pesado para el navegador, mejor creamos un ./auth.ts
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    //console.log("TOKEN MIDDLEWARE", token);

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/venta/:path*", "/cart/:path*"],
};