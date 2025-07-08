"use client";
import React from "react";
import { useState, useEffect } from "react";
import ProductList from "./ProductList";
import ProductCarousel from "./ProductCarousel";
import type { ProductSectionProps, ProductCardProps } from "@/app/types/props";

const ProductSection = ({
  title,
  filterType,
  categoryId,
  categoryLevel,
  promotionId,
  asCarousel,
  limit,
  selectedVariations,
  MinPrecioEnvia,
  MaxPrecioEnvia,
  minPrecio,
  maxPrecio,
  onPrecioChange, // Callback para manejar cambios de precio
}: ProductSectionProps) => {
  const [productos, setProductos] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [minPrecioState, setMinPrecio] = useState<string | null>(minPrecio || null);
  const [maxPrecioState, setMaxPrecio] = useState<string | null>(maxPrecio || null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const params = new URLSearchParams();

        switch (filterType) {
          case "bestSellers":
            // Falta implementar la lógica para bestSellers
            break;
          case "newArrivals":
            // Falta implementar la lógica para newArrivals
            break;
          case "onSale":
            // Falta implementar la lógica para onSale
            break;
          case "byCategory":
            if (categoryId) {
              params.append("categoryId", categoryId.toString());
              if (categoryLevel) {
                params.append("categoryLevel", categoryLevel.toString());
              }
            }
            break;
          case "byPromotion":
            if (promotionId) {
              params.append("onlyPromo", "true");
              params.append("promocionId", promotionId.toString());
            }
            break;
          case "onlyPromotions":
            params.append("onlyPromo", "true");
            break;
          case "byVariacion":
            if (categoryId) {
              params.append("categoryId", categoryId.toString());
              if (categoryLevel) {
                params.append("categoryLevel", categoryLevel.toString());
              }
              // Añadir variaciones si existen
              if (selectedVariations && selectedVariations.length > 0) {
                const variationIdsString = selectedVariations.join(",");
                params.append("variationIds", variationIdsString.toString());
              }
            }
            break;
          case "all":
            // No se añaden parámetros específicos
            break;
        }

        if (limit) {
          params.append("limit", limit.toString());
        }
        if (MinPrecioEnvia) {
          params.append("minPrecio", MinPrecioEnvia.toString());
        }
        if (MaxPrecioEnvia) {
          params.append("maxPrecio", MaxPrecioEnvia.toString());
        }

        const response = await fetch(`/api/productos?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Error al cargar los productos");
        }
        const data = await response.json();
        /*console.log("Datos obtenidos:", data);
        {
         products: Array(6),
         minPrecio: '180.00', 
         maxPrecio: '670.00'
       }
       */
        setProductos(data.products);
        setMinPrecio(data.minPrecio);     // Nuevo
        setMaxPrecio(data.maxPrecio);     // Nuevo
        console.log(onPrecioChange);
        //Si recibe valores de minPrecio y maxPrecio, los actualiza
        if (onPrecioChange) {
          console.log("onPrecioChange:", data.minPrecio, data.maxPrecio);
          onPrecioChange(data.minPrecio, data.maxPrecio);
        }
        console.log("Productos obtenidos:", data);
        console.log(`/api/productos?${params.toString()}`);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setError("Error al cargar los productos");
        setProductos([]);
      }
    }
    fetchProducts();
  }, [
    filterType,
    categoryId,
    categoryLevel,
    promotionId,
    limit,
    selectedVariations,
    MinPrecioEnvia,
    MaxPrecioEnvia,
  ]);

  return (
    <section>
      <div className="container-padding py-6 sm:py-8 lg:py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-6 sm:gap-8">
          <h2 className="text-xl sm:text-1xl lg:text-2xl font-bold text-gray-900 text-center sm:text-left">
            {title}
          </h2>
        </div>

        <div className="w-full">
          {asCarousel ? (
            <ProductCarousel productos={productos} />
          ) : (
            <ProductList
              productos={productos}
              horizontal={false}
              itemsPage={2}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
