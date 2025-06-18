import LoginForm from "@/app/components/auth/loginForm";
import { ShoppingBag } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-col md:flex-row flex-1">
        {/* Lado izquierdo visual */}
        <div className="w-full md:w-1/2 relative bg-ebony-800 to-indigo-800 text-white p-10 overflow-hidden">
          {/* Logo arriba */}
          <div className="flex items-center gap-2 mb-12">
            <ShoppingBag className="w-6 h-6 text-white lg:w-8 lg:h-8" />
            <h1 className="text-2xl font-bold">CompX</h1>
          </div>

          {/* Contenedor central centrado verticalmente */}
          <div className="flex flex-col justify-center h-[calc(100%-6rem)]">
            <div className="space-y-4 max-w-md">
              <h1 className="text-4xl lg:text-5xl font-bold">Hola, Bienvenido!</h1>
              <p className="text-lg lg:text-base text-white/90">
                Inicia sesión para gestionar tus productos, pedidos y más.
              </p>
            </div>
          </div>

          {/* Fondo decorativo opcional */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>

        {/* Lado derecho */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
