"use client";
import React from "react";
import { useState, useEffect } from "react";
import ProductList from "./ProductList";
import ProductCarousel from "./ProductCarousel";
import type { ProductSectionProps, ProductCardProps } from "@/app/types/props";

const sampleProducts: ProductCardProps[] = [
  {
    id: 1,
    nombre: "Camiseta Básica",
    descripcion: "Algodón 100%, varios colores",
    imagen_producto: "/images/camiseta.jpg",
    precio: 59.9,
    descuento: 0.2, // 20% OFF
  },
  {
    id: 2,
    nombre: "Pantalones Vaqueros",
    descripcion: "Blue denim, corte recto",
    imagen_producto: "/images/vaqueros.jpg",
    precio: 120,
  },
  {
    id: 3,
    nombre: "Zapatillas Deportivas",
    descripcion: "Con amortiguación especial",
    imagen_producto: "/images/zapatillas.jpg",
    precio: 249.5,
    descuento: 0.15, // 15% OFF
  },
  {
    id: 4,
    nombre: "Gorra Unisex",
    descripcion: "Algodón 100%",
    imagen_producto: "/images/gorra.jpg",
    precio: 35,
  },
  {
    id: 5,
    nombre: "Chaqueta Impermeable",
    descripcion: "Resistente al agua, talla única",
    imagen_producto: "/images/chaqueta.jpg",
    precio: 179.99,
    descuento: 0.3, // 30% OFF
  },
  {
    id: 6,
    nombre: "Chaqueta Impermeable",
    descripcion: "Resistente al agua, talla única",
    imagen_producto: "/images/chaqueta.jpg",
    precio: 179.99,
    descuento: 0.3, // 30% OFF
  },
  {
    id: 7,
    nombre: "Chaqueta Impermeable",
    descripcion: "Resistente al agua, talla única",
    imagen_producto: "/images/chaqueta.jpg",
    precio: 179.99,
    descuento: 0.3, // 30% OFF
  },
];

const ProductSection = ({
  title,
  filterType,
  categoryId,
  categoryLevel,
  promotionId,
  asCarousel,
  limit,
}: ProductSectionProps) => {
  const [productos, setProductos] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
              params.append("promotionId", promotionId.toString());
            }
            break;
          case "onlyPromotions":
            params.append("onlyPromo", "true");
            break;
          case "all":
            // No se añaden parámetros específicos
            break;
        }

        if (limit) {
          params.append("limit", limit.toString());
        }
        const response = await fetch(`/api/productos?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Error al cargar los productos");
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setError("Error al cargar los productos");
        setProductos([]);
      }
    }
    fetchProducts();
  }, [filterType, categoryId, categoryLevel, promotionId, limit]);

  return (
    <section>
      <div className="flex flex-col container mx-auto px-4 py-8 md:px-6 lg:px-8 gap-8">
        <h2 className="text-2xl font-bold">{title}</h2>
        {asCarousel ? (
          <ProductCarousel productos={productos} />
        ) : (
          <ProductList productos={productos} horizontal={false} />
        )}
      </div>
    </section>
  );
};

export default ProductSection;
