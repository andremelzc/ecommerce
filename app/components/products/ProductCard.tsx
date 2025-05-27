"use client";
import React from "react";
import type { ProductCardProps } from "@/app/types/props";
import { Search } from "lucide-react";

const ProductCard = ({
  id,
  nombre,
  imagen_producto,
  precio,
  descuento,
}: ProductCardProps) => {
  return (
    <div className="flex flex-col bg-white w-64 relative gap-1">
      {/* Imagen*/}
      <div className="w-full h-64 flex justify-center items-center relative">
        {<img src={imagen_producto} alt={nombre} />}
      </div>
      {/* Etiqueta de descuento*/}
      {descuento && (
        <div className="absolute top-0 left-0 bg-red-900 text-white text-xs p-2 border-2 rounded-lg">
          {Math.round(descuento * 100)}% OFF
        </div>
      )}
      {/*descuento && (
        <div className="w-full bg-ebony-800 text-white font-bold p-1 text-center border-b-2 rounded-lg text-sm">
          Promoción
        </div>
      )*/}
      {/* Icono de carrito */}
      {/* Datos */}
      <div className="flex flex-col w-full">
        <h3 className="text-lg ">{nombre}</h3>
        <div className="flex items-center gap-2">
          {descuento != null ? (
            <>
              <span className="text-2xl text-red-900 font-bold">
                S/ {(precio * (1 - descuento)).toFixed(2)}
              </span>
              <span className="text-sm line-through">S/ {precio}</span>
            </>
          ) : (
            <>
              <span className="text-2xl text-ebony-950 font-bold">S/ {precio}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
