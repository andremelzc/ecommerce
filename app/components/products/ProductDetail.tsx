"use client";
import React, { useState, useRef } from "react";
import type { ProductDetailProps } from "@/app/types/props";
import { Expand, X } from "lucide-react";

const Contador = ({ cantidad_stock }: { cantidad_stock: number }) => {
  const [cantidad, setCantidad] = useState(1);

  const incrementar = () => {
    setCantidad((prev) => (prev < cantidad_stock ? prev + 1 : prev));
  };

  const decrementar = () => {
    setCantidad((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div className="flex items-center gap-8">
      <strong>Cantidad: </strong>
      <button
        onClick={decrementar}
        className="bg-contador p-2 rounded-full hover:bg-gray-300 transition-colors w-8 h-8 flex items-center justify-center"
      >
        -
      </button>
      <span className="text-xl">{cantidad}</span>
      <button
        onClick={incrementar}
        className="bg-contador p-2 rounded-full hover:bg-gray-300 transition-colors w-8 h-8 flex items-center justify-center"
      >
        +
      </button>
    </div>
  );
};

const ProductDetail = ({
  id,
  nombre,
  descripcion,
  imagen_producto,
  precio,
  descuento,
  SKU,
  cantidad_stock,
  especificaciones,
  tipo_especificaciones,
  nivel_1,
  nivel_2,
  nivel_3,
  nombre_promocion,
}: ProductDetailProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const openFullScreen = () => setIsFullScreen(true);
  const closeFullScreen = () => setIsFullScreen(false);

  return (
    <div className="flex bg-white px-40 py-15 relative align-middle justify-center font-sans ">
      {/* Imagen*/}
      <div className="flex-1/2 items-center justify-center flex-col relative m-auto">
        {/* Breadcrumb */}
        <nav className="p-6 text-sm text-gray-600" aria-label="Breadcrumb">
          <ol className="list-reset flex">
            <li>
              <a href="#" className="hover:underline">
                Inicio
              </a>
            </li>
            {nivel_1 && (
              <>
                <li className="mx-2">{">"}</li>
                <li>
                  <a href="#" className="hover:underline">
                    {nivel_1}
                  </a>
                </li>
              </>
            )}
            {nivel_2 && (
              <>
                <li className="mx-2">{">"}</li>
                <li>
                  <a href="#" className="hover:underline">
                    {nivel_2}
                  </a>
                </li>
              </>
            )}
            {nivel_3 && (
              <>
                <li className="mx-2">{">"}</li>
                <li>
                  <a href="#" className="hover:underline">
                    {nivel_3}
                  </a>
                </li>
              </>
            )}
            <li className="mx-2">{">"}</li>
            <li className="font-bold">{nombre}</li>
          </ol>
        </nav>
        <div className="relative flex" ref={imageContainerRef}>
          <img
            src={
              !imagen_producto || imagen_producto === "null"
                ? "https://img.freepik.com/vector-gratis/ilustracion-icono-doodle-engranaje_53876-5596.jpg?semt=ais_hybrid&w=740"
                : imagen_producto
            }
            alt={nombre}
            className="max-h-[400px] max-w-full object-contain m-auto"
          />
          {!isFullScreen && descuento && (
            <div className="absolute top-0 right-0 bg-red-900 text-white text-xs p-2 border-2 rounded-lg">
              {Math.round(descuento * 100)}% OFF
            </div>
          )}
          {!isFullScreen && (
            <button
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-colors z-20"
              title="Ver en pantalla completa"
              onClick={openFullScreen}
              type="button"
            >
              <Expand className="w-6 h-6 text-gray-700" />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1/2 px-40 flex-col m-auto">
        <div className="w-full bg-red-900 text-white font-bold p-1 text-center border-b-2 rounded-lg text-sm mb-3">
          {nombre_promocion}
        </div>
        <h3 className="text-5xl text-balance ">{nombre.toUpperCase()}</h3>
        <div className="w-full bg-ebony-950 border-b-2 rounded-lg my-5" />
        <div className="flex w-full justify-center items-center gap-2 my-5">
          {descuento != null ? (
            <>
              <span className="text-2xl text-button font-bold">
                S/ {(precio * (1 - descuento)).toFixed(2)}
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

        <div className="w-full bg-ebony-950 border-b-2 rounded-lg my-5" />

        <div className="text-balance text-center my-5">{descripcion}</div>

        <div className="text-2xl flex flex-col gap-4">
          <div>
            <strong>SKU</strong>: {SKU}
          </div>
          {tipo_especificaciones && especificaciones && (
            <div>
              <strong>
                {tipo_especificaciones.charAt(0).toUpperCase()}
                {tipo_especificaciones.slice(1).toLowerCase()}
              </strong>
              : {especificaciones.charAt(0).toUpperCase()}
              {especificaciones.slice(1).toLowerCase()}
            </div>
          )}
          <div>
            <strong>En stock: </strong> {cantidad_stock}
          </div>
        </div>
        <div className="w-full bg-ebony-950 border-b-2 rounded-lg my-5" />
        <div className="text-2xl">
          <Contador cantidad_stock={cantidad_stock} />
        </div>
        <div className="flex w-full my-5">
          <button className="bg-button text-white font-bold mt-3 p-4 text-2xl rounded-lg hover:bg-ebony-700 transition-colors">
            Añadir al carrito
          </button>
        </div>
      </div>

      {/* Modal de Fullscreen */}
      {isFullScreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={closeFullScreen}
        >
          <img
            src={
              !imagen_producto || imagen_producto === "null"
                ? "https://img.freepik.com/vector-gratis/ilustracion-icono-doodle-engranaje_53876-5596.jpg?semt=ais_hybrid&w=740"
                : imagen_producto
            }
            alt={nombre}
            className="max-h-[350px] max-w-full object-contain"
          />
          <button
            className="absolute top-6 right-6 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-colors"
            onClick={closeFullScreen}
            title="Cerrar"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
