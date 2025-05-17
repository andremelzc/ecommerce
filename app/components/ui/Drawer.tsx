"use client";

import React from "react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import {Transition} from "@headlessui/react";
import type { CategoriaNivevl1 } from "@/app/types/categoria";

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Cambiar por un array que venga de la API
const categoriasData: CategoriaNivevl1[] = [
  {
    id: 1,
    nombre: "Periféricos",
    subcategorias: [
      {
        id: 1,
        nombre: "Monitores",
        subcategorias: [], // sin nivel 3
      },
      {
        id: 2,
        nombre: "Teclados",
        subcategorias: [], // sin nivel 3
      },
      {
        id: 3,
        nombre: "Ratones",
      },
      {
        id: 4,
        nombre: "Auriculares",
      },
    ],
  },
  {
    id: 2,
    nombre: "Componentes",
    subcategorias: [
      {
        id: 6,
        nombre: "Placas base",
      },
      {
        id: 7,
        nombre: "Tarjetas gráficas",
      },
      {
        id: 8,
        nombre: "Procesadores",
        subcategorias: [
          { id: 11, nombre: "Refrigeración líquida" },
          { id: 12, nombre: "Ventiladores CPU" },
          { id: 13, nombre: "Pasta térmica" },
        ],
      },
      {
        id: 9,
        nombre: "Discos duros",
        subcategorias: [
          { id: 14, nombre: "HDD" },
          { id: 15, nombre: "SSD" },
        ],
      },
      {
        id: 10,
        nombre: "RAM",
      },
    ],
  },
];

const Drawer = ({ isOpen, onClose }: DrawerProps) => {
  // Cerrar presionando la tecla escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Activar el panel de subcategorías
  const [activeCat, setActiveCat] = useState<CategoriaNivevl1 | null>(null);

  // Cerrar el panel de subcategorías
  const handleCloseDrawer = () => {
    setActiveCat(null);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed h-full inset-0 flex bg-black/40 flex-1 z-20"
        onClick={handleCloseDrawer}
      ></div>
      {/* Panel */}
      <aside className="fixed h-full inset-0 flex bg-ebony-950 h-full w-80 text-white px-8 py-10 shadow-lg flex flex-col z-30">
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
          <div className="absolute flex left-80 inset-y-0 w-full bg-white transition-transform duration-200">
            <div className="w-full px-8 py-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl text-black font-bold pl-2">
                  {activeCat.nombre}
                </h2>
                <a className="text-sm underline text-black">Ver todo</a>
              </div>

              <div className="bg-black h-[1px] my-4"></div>
              <div className="flex flex-col w-full">
                <ul>
                  {activeCat.subcategorias?.map((cat2) => (
                    <li key={cat2.id}>
                      <button className="flex items-center justify-between w-full text-left text-lg p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-black">
                        {cat2.nombre}
                        <ChevronDown />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>,
    document.body
  );
};

export default Drawer;
