"use client";
import React from "react";
import ProductCard from "./ProductCard";
import { ProductListProps } from "@/app/types/props";

const ProductList = ({ productos, horizontal }: ProductListProps) => {
  // Clase dinámica por si es horizontal o vertical
  const containerClass = horizontal
    ? "flex overflow-x-auto gap-4"
    : "grid grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-x-4 gap-y-8";

  return (
    <div className={containerClass}>
      {productos.map((producto) => (
        <ProductCard
          key={producto.producto_id}
          producto_id={producto.producto_id}
          nombre={producto.nombre}
          descripcion={producto.descripcion}
          imagen_producto={producto.imagen_producto}
          precio={producto.precio}
          descuento={producto.descuento}
        />
      ))}
    </div>
  );
};

export default ProductList;
