"use client";

import React from "react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { Transition } from "@headlessui/react";
import type { CategoriaNivel1 } from "@/app/types/categoria";
import type { DrawerProps } from "@/app/types/props";
import Loadingspinner from "@/app/components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

const Drawer = ({ isOpen, onClose }: DrawerProps) => {
  const router = useRouter();
  // LLamada al api
  const [categoriasData, setCategoriasData] = useState<CategoriaNivel1[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("/api/categorias") // o la ruta que tengas que te retorne toda la estructura anidada
        .then((res) => res.json())
        .then((data) => {
          setCategoriasData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error cargando categorías:", error);
          setLoading(false);
        });
    }
  }, [isOpen]);

  // Cerrar presionando la tecla escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Mostrar cargando
  const [loading, setLoading] = useState(false);

  // Activar el panel de subcategorías
  const [activeCat, setActiveCat] = useState<CategoriaNivel1 | null>(null);
  const [activeCat2, setActiveCat2] = useState<number | null>(null);

  // Cerrar el panel de subcategorías
  const handleCloseDrawer = () => {
    setActiveCat(null);
    setActiveCat2(null);
    onClose();
  };

  // Maneja el click en categorias nivel 2
  const toggleSubcategoria = (id: number) => {
    setActiveCat2(
      (prev) =>
        prev === id
          ? null // Si ya está expandida, la cerramos
          : id // Si no está expandida, la abrimos
    );
  };

  // Estados para animar el panel de categorías
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  // Efecto para manejar la visibilidad y animación del panel
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  // Estado para animar el panel de subcategorías
  const [showSubPanel, setShowSubPanel] = useState(false);
  const [isSubPanelAnimating, setIsSubPanelAnimating] = useState(false);

  useEffect(() => {
    if (activeCat) {
      setShowSubPanel(true);
      setTimeout(() => setIsSubPanelAnimating(true), 10);
    } else {
      setIsSubPanelAnimating(false);
      setTimeout(() => setShowSubPanel(false), 300);
    }
  }, [activeCat]);

  // Función para volver al panel principal (móvil)
  const handleBackToMain = () => {
    setActiveCat(null);
    setActiveCat2(null);
  };

  if (!isVisible) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-60"
        onClick={handleCloseDrawer}
      ></div>
      
      {/* Panel Principal */}
      <aside
        className={`fixed inset-y-0 left-0 bg-ebony-950 text-white shadow-lg flex flex-col z-70 transition-transform duration-300 ease-in-out
          w-full sm:w-80 md:w-96
          ${isAnimating ? "translate-x-0" : "-translate-x-full"}
          ${activeCat ? "lg:translate-x-0" : "translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
          <h2 className="text-lg sm:text-xl font-bold">Categorías</h2>
          <button
            className="hover:scale-110 transition-transform cursor-pointer p-1"
            onClick={handleCloseDrawer}
          >
            <X size={24} className="sm:w-7 sm:h-7" />
          </button>
        </div>
        
        <div className="bg-white h-[1px] mx-4 sm:mx-6 lg:mx-8"></div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loadingspinner />
            </div>
          ) : (
            <ul className="space-y-1">
              {categoriasData.map((cat1) => (
                <li key={cat1.id}>
                  <button
                    className="flex items-center justify-between w-full text-left text-base sm:text-lg p-3 hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setActiveCat(cat1)}
                  >
                    <span className="truncate pr-2">{cat1.nombre}</span>
                    <ChevronRight className="flex-shrink-0" size={20} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Panel de Subcategorías */}
      {activeCat && (
        <div
          className={`fixed inset-y-0 bg-white z-80 shadow-lg transition-transform duration-300 ease-in-out
            w-full lg:w-96 lg:left-80 xl:left-96
            ${isSubPanelAnimating ? "translate-x-0" : "translate-x-full"}
            lg:${isSubPanelAnimating ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Header del subpanel */}
            <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8 border-b">
              {/* Botón volver (solo móvil) */}
              <button
                className="lg:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={handleBackToMain}
              >
                <ChevronRight className="rotate-180" size={20} />
              </button>
              
              <h2 className="text-lg sm:text-xl text-black font-bold flex-1 lg:flex-none truncate px-2 lg:px-0">
                {activeCat.nombre}
              </h2>
              
              <button
                className="text-sm underline text-black hover:no-underline transition-all whitespace-nowrap"
                onClick={() => {
                  router.push(`/categoria/1/${activeCat.id}`);
                  onClose();
                }}
              >
                Ver todo
              </button>
            </div>

            {/* Contenido del subpanel */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <ul className="space-y-1">
                {activeCat.subcategorias?.map((cat2) => (
                  <li key={cat2.id}>
                    <button
                      className="flex items-center justify-between w-full text-left text-base sm:text-lg p-3 hover:bg-gray-100 rounded-lg transition-colors text-black"
                      onClick={() => {
                        if (cat2.subcategorias?.length) {
                          toggleSubcategoria(cat2.id);
                        } else {
                          router.push(`/categoria/2/${cat2.id}`);
                          onClose();
                        }
                      }}
                    >
                      <span className="truncate pr-2">{cat2.nombre}</span>
                      {cat2.subcategorias?.length ? (
                        activeCat2 === cat2.id ? (
                          <ChevronUp className="flex-shrink-0" size={20} />
                        ) : (
                          <ChevronDown className="flex-shrink-0" size={20} />
                        )
                      ) : null}
                    </button>
                    
                    {/* Subcategorías de nivel 3 */}
                    {activeCat2 === cat2.id && cat2.subcategorias && (
                      <div className="ml-4 mt-2 space-y-1">
                        <ul className="space-y-1">
                          {cat2.subcategorias.map((cat3) => (
                            <li key={cat3.id}>
                              <button 
                                className="flex items-center justify-between w-full text-left text-sm sm:text-base p-2 hover:bg-gray-100 rounded-lg transition-colors text-black"
                                onClick={() => {
                                  router.push(`/categoria/3/${cat3.id}`);
                                  onClose();
                                }}
                              >
                                <span className="truncate">{cat3.nombre}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                        <button
                          className="text-sm underline text-black hover:no-underline transition-all ml-2 mt-2"
                          onClick={() => {
                            router.push(`/categoria/2/${cat2.id}`);
                            onClose();
                          }}
                        >
                          Ver todo
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
};

export default Drawer;