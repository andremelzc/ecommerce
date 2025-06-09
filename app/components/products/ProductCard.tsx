"use client";
import React, { useState } from "react";
import type { ProductCardProps } from "@/app/types/props";
import { Search, ShoppingCart } from "lucide-react";
import Loadingspinner from "../ui/LoadingSpinner";
import { useCart } from "@/app/context/CartContext";
import type { CartItem } from "@/app/types/itemCarrito";

const ProductCard = ({
  producto_id,
  id_producto_especifico,
  nombre,
  imagen_producto,
  precio,
  porcentaje_desc,
}: ProductCardProps) => {
  // Manejar los estados de la imagen (hover y errores)
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Si hay descuento, calculamos el precio final y el porcentaje de descuento
  const precioFinal = porcentaje_desc ? precio * (1 - porcentaje_desc) : precio;
  const porcentajeDescuento = porcentaje_desc
    ? Math.round(porcentaje_desc * 100)
    : null;

  // Al darle click al carrito de la imagen
  const { addItem } = useCart(); 
  
  const handleAddToCart = async () => {
    if (id_producto_especifico === undefined) {
      console.error("producto_id es undefined, no se puede agregar al carrito.");
      return;
    }

    const item: CartItem = {
      productId: id_producto_especifico, 
      nombre,
      descripcion: "", 
      image_producto: imagen_producto || "",
      cantidad: 1,
      precio,
    };

    try {
      await addItem(item);
      
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  // Manejar el error de carga de imagen
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // Importante: marcamos como "cargado" para ocultar el spinner
  };

  return (
    <div className="group flex flex-col bg-white w-full max-w-xs mx-auto relative gap-1 rounded-lg hover: transition-all duration-300 overflow-hidden p-2 sm:p-3 lg:p-4">
      {/* Container de la imagen */}
      <div
        className="w-full h-48 sm:h-56 lg:h-64 flex justify-center items-center relative cursor-pointer overflow-hidden p-2 sm:p-3 lg:p-4"
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
            className={`w-auto h-auto max-w-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 sm:group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            src={
              !imagen_producto || imagen_producto === "null"
                ? "https://img.freepik.com/vector-gratis/ilustracion-icono-doodle-engranaje_53876-5596.jpg?semt=ais_hybrid&w=740"
                : imagen_producto
            }
            alt={nombre}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            loading="lazy"
          />
        )}

        {/* Overlay con boton para agregar carrito */}
        <div
          className={`absolute right-1 top-1 sm:right-2 sm:top-2 flex items-center transition-all duration-300 ease-out ${
            isHovered ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <button
            onClick={handleAddToCart}
            title="Agregar al carrito"
            className="p-1.5 sm:p-2 bg-ebony-950 rounded-full hover:bg-ebony-800 cursor-pointer transition-colors duration-300"
          >
            <ShoppingCart size={24} color="white" />
          </button>
        </div>
      </div>

      {/* Etiqueta de descuento*/}
      {porcentaje_desc && (
        <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-red-900 text-white text-xs sm:text-sm p-1.5 sm:p-2 border-2 rounded-md sm:rounded-lg">
          <span className="font-semibold">{porcentajeDescuento}% OFF</span>
        </div>
      )}

      {/* Datos */}
      <div className="flex flex-col w-full px-1 sm:px-2">
        <div className="mb-2">
          <h3 className="text-sm sm:text-base lg:text-lg font-medium h-12 sm:h-14 lg:h-16 overflow-hidden line-clamp-3">
            {nombre}
          </h3>
        </div>
        <div className="flex items-center gap-2 mt-auto">
          {porcentaje_desc != null ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-lg sm:text-xl lg:text-2xl text-red-900 font-bold">
                S/ {precioFinal.toFixed(2)}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                S/ {precio}
              </span>
            </div>
          ) : (
            <>
              <span className="text-lg sm:text-xl lg:text-2xl text-ebony-950 font-bold">
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
