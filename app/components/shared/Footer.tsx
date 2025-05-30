
import React from "react";

const Footer = () => {
 
  return (
    <>
      <nav className="bg-ebony-950">
        <div className="max-w-7xl mx-auto px-8 py-8 flex items-center justify-between"> 
            <div className="text-white text-sm">
                &copy; {new Date().getFullYear()} CompX. Todos los derechos reservados.
            </div>
            <div className="flex space-x-4">
                <a href="/privacy" className="text-gray-400 hover:text-white">
                Política de Privacidad
                </a>
                <a href="/terms" className="text-gray-400 hover:text-white">
                Términos de Uso
                </a>
                <a href="/contact" className="text-gray-400 hover:text-white">
                Contáctanos
                </a>
            </div>        
        </div>
      </nav>
    </>
  );
};

export default Footer;
