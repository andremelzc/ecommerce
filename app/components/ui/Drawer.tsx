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

  if (!isVisible) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed h-full inset-0 flex bg-black/40 flex-1 z-60"
        onClick={handleCloseDrawer}
      ></div>
      {/* Panel */}
      <aside
        className={`fixed h-full inset-0 flex bg-ebony-950 h-full w-80 text-white px-8 py-10 shadow-lg flex flex-col z-70 transition-transform duration-300 ease-in-out ${
          isAnimating ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Categorías*/}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold pl-2">Categorías</h2>
          <button
            className="hover:scale-110 transition-transform cursor-pointer"
            onClick={handleCloseDrawer}
          >
            <X size={30} />
          </button>
        </div>
        <div className="bg-white h-[1px] my-4"></div>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loadingspinner />
          </div>
        ) : (
          <>
            <ul>
              {categoriasData.map((cat1) => (
                <li key={cat1.id}>
                  <button
                    className="flex items-center justify-between w-full text-left text-lg p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
                    onClick={() => setActiveCat(cat1)}
                  >
                    {cat1.nombre}
                    <ChevronRight />
                  </button>
                </li>
              ))}
            </ul>
            {/* Sub categorías*/}
            {activeCat && (
              <div
                className={`absolute flex left-80 inset-y-0 w-full bg-white z-80 transform transition-transform duration-300 ease-in-out ${
                  isSubPanelAnimating ? "translate-x-0" : "-translate-x-0"
                }`}
              >
                <div className="w-full px-8 py-10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl text-black font-bold pl-2">
                      {activeCat.nombre}
                    </h2>
                    <a className="text-sm underline text-black" href="">
                      Ver todo
                    </a>
                  </div>

                  <div className="bg-black h-[1px] my-4"></div>
                  <div className="flex flex-col w-full">
                    <ul>
                      {activeCat.subcategorias?.map((cat2) => (
                        <li key={cat2.id}>
                          <button
                            className="flex items-center justify-between w-full text-left text-lg p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-black"
                            onClick={() => {
                              if (cat2.subcategorias?.length) {
                                toggleSubcategoria(cat2.id);
                              } else {
                                router.push(`/categoria/2/${cat2.id}`);
                                onClose(); // Cierra el drawer después
                              }
                            }}
                          >
                            {cat2.nombre}
                            {/* Si no tiene subcategorías (lo cual no pasa, pero por si acaso), no tiene flechita
                            Si ya ha sido presionado, tiene la flechita para arriba, no para abajo*/}
                            {cat2.subcategorias?.length ? (
                              activeCat2 === cat2.id ? (
                                <ChevronUp />
                              ) : (
                                <ChevronDown />
                              )
                            ) : null}
                          </button>
                          {/* sub categorías de nivel 3 */}
                          {activeCat2 === cat2.id && cat2.subcategorias && (
                            <ul>
                              {cat2.subcategorias.map((cat3) => (
                                <li key={cat3.id}>
                                  <button className="flex items-center justify-between w-full text-left text-sm p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-black">
                                    {cat3.nombre}
                                  </button>
                                </li>
                              ))}
                              <a
                                className="pl-2 text-sm underline text-black"
                                href=""
                              >
                                Ver todo
                              </a>
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </aside>
    </>,
    document.body
  );
};

export default Drawer;
