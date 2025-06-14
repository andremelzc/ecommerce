// app/layout.tsx
import type { Metadata } from "next";
import ClientLayout from "../components/shared/ClientLayout";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Compx",
  description: "Descripción de mi aplicación",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
