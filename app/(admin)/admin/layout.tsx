import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        {/* Navbar admin */}
        <header className="bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">🛒 CompX</span>
            <span className="text-lg font-medium text-gray-600">Panel de administrador</span>
          </div>
          <nav className="space-x-4">
            <Link href="/admin/add-products" className="text-blue-600 hover:underline">
              ➕ Agregar producto
            </Link>
            {/* Puedes agregar más links aquí */}
          </nav>
        </header>

        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
