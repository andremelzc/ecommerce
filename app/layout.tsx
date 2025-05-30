// app/layout.tsx
import "./globals.css";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mi App',
  description: 'Descripción de mi aplicación',
}

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}