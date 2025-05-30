"use client";
import React, { useState } from "react";
import type { ProductCardProps } from "@/app/types/props";
import { Search, ShoppingCart } from "lucide-react";
import Loadingspinner from "../ui/LoadingSpinner";

const ProductCard = ({
  id,
  nombre,
  imagen_producto,
  precio,
  descuento,
}: ProductCardProps) => {
  // Manejar los estados de la imagen (hover y errores)
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Si hay descuento, calculamos el precio final y el porcentaje de descuento
  const precioFinal = descuento ? precio * (1 - descuento) : precio;
  const porcentajeDescuento = descuento ? Math.round(descuento * 100) : null;

  console.log("Producto:", {
    id,
    nombre,
    imagen_producto,
    precio,
    descuento,
  });

  // Al darle click al carrito de la imagen
  const handleAddToCart = () => {};

  // Manejar el error de carga de imagen
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // Importante: marcamos como "cargado" para ocultar el spinner
  };

  return (
    <div className="group flex flex-col bg-white w-64 relative gap-1 rounded-lg hover: transition-all duration-300 overflow-hidden p-2">
      {/* Container de la imagen */}
      <div
        className="w-full h-64 flex justify-center items-center relative cursor-pointer overflow-hidden p-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Loading Spinner - solo se muestra mientras carga */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse flex items-center justify-center">
            <Loadingspinner />
          </div>
        )}

        {/* Imagen principal */}
        {!imageError && (
          <img
            className={`w-auto h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            src={!imagen_producto || imagen_producto === "null"
                ? "https://img.freepik.com/vector-gratis/ilustracion-icono-doodle-engranaje_53876-5596.jpg?semt=ais_hybrid&w=740"
                : imagen_producto}
            alt={nombre}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            loading="lazy"
          />
        )}

        {/* Overlay con boton para agregar carrito */}
        <div
          className={`absolute right-2 bottom-2 flex items-center transition-all duration-300 ease-out ${
            isHovered ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <button
            onClick={handleAddToCart}
            title="Agregar al carrito"
            className="p-2 bg-ebony-950 rounded-full hover:bg-ebony-800 cursor-pointer transition-colors duration-300"
          >
            <ShoppingCart size={24} color="white" />
          </button>
        </div>
      </div>

      {/* Etiqueta de descuento*/}
      {descuento && (
        <div className="absolute top-0 left-0 bg-red-900 text-white text-xs p-2 border-2 rounded-lg">
          {porcentajeDescuento}% OFF
        </div>
      )}

      {/* Datos */}
      <div className="flex flex-col w-full">
        <div>
          <h3 className="text-lg h-16">{nombre}</h3>
        </div>
        <div className="flex items-center gap-2">
          {descuento != null ? (
            <>
              <span className="text-2xl text-red-900 font-bold">
                S/ {precioFinal.toFixed(2)}
              </span>
              <span className="text-sm line-through">S/ {precio}</span>
            </>
          ) : (
            <>
              <span className="text-2xl text-ebony-950 font-bold">
                S/ {precio}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;