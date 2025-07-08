// /app/categoria/[categoryLevel]/[categoryId]/page.tsx
'use client';

import React, { useState } from "react";
import VariationBox from "@/app/components/ui/VariationBox";
import ProductSection from "@/app/components/products/ProductSection";
import { categorias } from "@/lib/categorias";
import CategoryGrid from "@/app/components/ui/CategoriaGrid";
import PriceRange from "@/app/components/products/ProductFilterPrice";
import { Mina } from "next/font/google";
import { init } from "next/dist/compiled/webpack/webpack";


// Función que trae el nombre de los id's, permite hacer esto:  "Inicio/perifericos/monitor"
function getBreadcrumb(level: number, id: number): string[] {
  const path: string[] = ["Inicio"];

  for (const cat1 of categorias) {
    if (level === 1 && cat1.id === id) {
      path.push(cat1.nombre);
      break;
    }
    for (const cat2 of cat1.subcategorias) {
      if (level === 2 && cat2.id === id) {
        path.push(cat1.nombre, cat2.nombre);
        break;
      }
      for (const cat3 of cat2.subsubcategorias ?? []) {
        if (level === 3 && cat3.id === id) {
          path.push(cat1.nombre, cat2.nombre, cat3.nombre);
          break;
        }
      }
    }
  }

  return path;
}

export default function CategoriaPage({ params }: { params: { level: string; id: string } }) {
  const categoryLevel = Number(params.level);
  const categoryId = Number(params.id);
  const [selectedVariations, setSelectedVariations] = useState<number[]>([]);
  const [minPrecio, setMinPrecio] = useState<string | null>(null);
  const [maxPrecio, setMaxPrecio] = useState<string | null>(null);
  const [hasInitializedRange, setHasInitializedRange] = useState(false);
  const [initialMin, setInitialMin] = useState<number | null>(null);
  const [initialMax, setInitialMax] = useState<number | null>(null);


  //Para cambiar dinamicamente el filtro de ProductSection
  const filterType = selectedVariations.length > 0 ? "byVariacion" : "byCategory";
  // Usa una key única para forzar el remount de ProductSection
  const productSectionKey = `${categoryId}-${categoryLevel}-${selectedVariations.join(',')}`;
  // Breadcrumb
  const breadcrumb = getBreadcrumb(categoryLevel, categoryId);
  console.log("Precio minimo:", minPrecio);
  console.log("Precio maximo:", maxPrecio);
  return (
    <div className="flex gap-4 px-4 py-6">
      {/* Lado izquierdo - Variaciones */}
      <div className="w-64 shrink-0">
        <VariationBox
          categoryLevel={categoryLevel}
          categoryId={categoryId}
          setSelectedVariations={setSelectedVariations} // Pasamos el setter a VariationBox
        />
        <PriceRange
          min={Number(initialMin ?? 0)}
          max={Number(initialMax ?? 0)}
          onChange={(nuevoMin, nuevoMax) => {
            console.log("Nuevo rango elegido:", nuevoMin, nuevoMax);
            console.log("precio minimo original:", minPrecio);
            console.log("precio maximo original:", maxPrecio);
            setMinPrecio(nuevoMin.toString());
            setMaxPrecio(nuevoMax.toString());
          }}
        />
      </div>

      {/* Lado derecho - Breadcrumb y productos */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Breadcrumb */}
        <div className="flex justify-center">
          <nav className="text-sm text-gray-600">
            {breadcrumb.map((item, i) => (
              <span key={i}>
                {i > 0 && " / "}
                <span className={i === breadcrumb.length - 1 ? "text-red-500" : ""}>
                  {item}
                </span>
              </span>
            ))}
          </nav>
        </div>
        {/* Categorías hijas */}
        <CategoryGrid level={categoryLevel} id={categoryId} />
        {/* Productos */}
        <ProductSection
          title="Productos en esta categoría"
          key={productSectionKey}
          MinPrecioEnvia={minPrecio}
          MaxPrecioEnvia={maxPrecio}
          filterType={filterType}
          categoryLevel={categoryLevel}
          categoryId={categoryId}
          limit={20}
          asCarousel={false}
          selectedVariations={selectedVariations} // Pasamos las variaciones seleccionadas
          onPrecioChange={(minPrecio, maxPrecio) => {
            if (!hasInitializedRange) {
              console.log("Callback en page:", minPrecio, maxPrecio);
              setMinPrecio(minPrecio);
              setMaxPrecio(maxPrecio);
              setInitialMin(Number(minPrecio));
              setInitialMax(Number(maxPrecio));
              setHasInitializedRange(true);
            }
          }}
        />
      </div>
    </div>
  );
}
