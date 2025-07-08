// app/layout.tsx
import type { Metadata } from "next";
import { usePathname } from "next/navigation";
import ClientLayout from "../components/shared/ClientLayout";
import "@/app/globals.css";
// Agregando google analytcis
import { GoogleAnalytics } from '@next/third-parties/google';


export const metadata: Metadata = {
  title: "Compx",
  description: "Descripción de mi aplicación",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ?? ''} />
      </body>
    </html>
  );
}
