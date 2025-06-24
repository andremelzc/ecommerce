// types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // 
      name?: string | null;
      email?: string | null;
      image?: string | null;
      surname?: string | null;
      phone?: string | null;
      typeDocument?: string | null;
      documentId?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface JWT {
    id?: string;
  }
}
