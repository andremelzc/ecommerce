"use client";
import React, { useState, useEffect } from "react";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState<string>('2024'); // Fallback year
  
  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="bg-ebony-950">
        <div className="container-padding py-8 flex items-center justify-between">
          <div className="text-white text-sm">
            &copy; {currentYear} CompX. Todos los derechos reservados.
          </div>
          <div className="flex space-x-4">
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Política de Privacidad
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Términos de Uso
            </a>
            <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contáctanos
            </a>
          </div>
      </div>
    </footer>
  );
};

export default Footer;