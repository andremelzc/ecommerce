"use client";
import React, { useState } from "react";
import type { ProductDetailProps } from "@/app/types/props";
import { Expand, X } from "lucide-react";

function Breadcrumb({ nivel_1, nivel_2, nivel_3, nombre, isFullScreen }: any) {
  if (isFullScreen) return null;
  return (
    <nav
      className="absolute z-100 pt-22 text-sm text-gray-600 hidden lg:block"
      aria-label="Breadcrumb"
    >
      <ol
        className="list-reset flex"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <a href="/" itemProp="item">
            <span itemProp="name">Inicio</span>
          </a>
          <meta itemProp="position" content="1" />
        </li>
        {nivel_1 && (
          <>
            <li className="mx-2">{">"}</li>
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <a href="#" itemProp="item">
                <span itemProp="name">{nivel_1}</span>
              </a>
              <meta itemProp="position" content="2" />
            </li>
          </>
        )}
        {nivel_2 && (
          <>
            <li className="mx-2">{">"}</li>
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <a href="#" itemProp="item">
                <span itemProp="name">
                  {nivel_2.length > 12 ? nivel_2.slice(0, 7) + "..." : nivel_2}
                </span>
              </a>
              <meta itemProp="position" content="3" />
            </li>
          </>
        )}
        {nivel_3 && (
          <>
            <li className="mx-2">{">"}</li>
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <a href="#" itemProp="item">
                <span itemProp="name">
                  {nivel_3.length > 12 ? nivel_3.slice(0, 7) + "..." : nivel_3}{" "}
                </span>
              </a>
              <meta itemProp="position" content="4" />
            </li>
          </>
        )}
        <li className="mx-2">{">"}</li>
        <li
          className="font-bold"
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <span itemProp="name">
            {nombre.length > 12 ? nombre.slice(0, 7) + "..." : nombre}
          </span>
          <meta itemProp="position" content="5" />
        </li>
      </ol>
    </nav>
  );
}

function ProductImage({
  imagen_producto,
  nombre,
  descuento,
  openFullScreen,
  isFullScreen,
}: any) {
  return (
    <section
      className="flex-1/2 items-center justify-center flex-col relative m-auto max-w-full xl:max-w-2/5"
      aria-label="Imagen del producto"
    >
      <div className="relative flex w-full m-auto">
        <img
          src={
            !imagen_producto || imagen_producto === "null"
              ? "https://img.freepik.com/vector-gratis/ilustracion-icono-doodle-engranaje_53876-5596.jpg?semt=ais_hybrid&w=740"
              : imagen_producto
          }
          alt={`Imagen de ${nombre}`}
          className="max-h-[400px] lg:max-w-2/3 2xl:max-w-5/6 object-contain m-auto"
          itemProp="image"
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
    </section>
  );
}

function ProductInfo({
  nombre_promocion,
  nombre,
  precio,
  descuento,
  descripcion,
  SKU,
  tipo_especificaciones,
  especificaciones,
  cantidad_stock,
}: any) {
  return (
    <section
      className="w-full 2xl:lg:w-1/3 lg:w-2/5 px-2 sm:px-8 md:px-12 lg:px-16 xl:px-20 flex-col m-auto border border-gray-200 shadow-xl rounded-2xl pt-4 sm:pt-5"
      itemScope
      itemType="https://schema.org/Product"
    >
      {nombre_promocion && (
        <div className="w-full bg-red-900 text-white font-bold p-1 text-center border-b-2 rounded-lg text-xs sm:text-sm mb-3">
          {nombre_promocion}
        </div>
      )}
      <h1
        className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl text-balance "
        itemProp="name"
      >
        {nombre}
      </h1>
      <div className="w-full bg-ebony-950 border-b-2 rounded-lg my-3 sm:my-5" />
      <div className="flex w-full justify-center items-center gap-2 my-3 sm:my-5">
        {descuento != null ? (
          <>
            <span
              className="text-xl sm:text-2xl text-button font-bold"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              S/{" "}
              <span itemProp="price">
                {(precio * (1 - descuento)).toFixed(2)}
              </span>
              <meta itemProp="priceCurrency" content="PEN" />
            </span>
            <span className="text-xs sm:text-sm line-through">S/ {precio}</span>
          </>
        ) : (
          <span
            className="text-xl sm:text-2xl text-ebony-950 font-bold"
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
          >
            S/ <span itemProp="price">{precio}</span>
            <meta itemProp="priceCurrency" content="PEN" />
          </span>
        )}
      </div>
      <div className="w-full bg-ebony-950 border-b-2 rounded-lg my-3 sm:my-5" />
      <p
        className="text-justify my-3 sm:my-5 text-base sm:text-lg lg:text-[1rem] "
        itemProp="description"
      >
        {descripcion}
      </p>
      <ProductSpecs
        SKU={SKU}
        tipo_especificaciones={tipo_especificaciones}
        especificaciones={especificaciones}
        cantidad_stock={cantidad_stock}
      />
      <div className="w-full bg-ebony-950 border-b-2 rounded-lg my-3 sm:my-5 " />
      <div className="w-full">
        <Contador cantidad_stock={cantidad_stock} />
      </div>
      <div className="flex w-full my-3 sm:my-5">
        <button className="w-full bg-button text-white font-bold mt-3 p-3 sm:p-4 text-lg sm:text-2xl lg:text-xl xl:text-1.5xl rounded-lg hover:bg-ebony-700 transition-colors">
          Añadir al carrito
        </button>
      </div>
    </section>
  );
}

function ProductSpecs({
  SKU,
  tipo_especificaciones,
  especificaciones,
  cantidad_stock,
}: any) {
  return (
    <ul
      className="text-2xl flex flex-col gap-4 lg: text-[1.2rem]"
      itemProp="additionalProperty"
      itemScope
      itemType="https://schema.org/PropertyValue"
    >
      <li>
        <strong>SKU</strong>: <span itemProp="value">{SKU}</span>
      </li>
      {tipo_especificaciones && especificaciones && (
        <li>
          <strong>
            {tipo_especificaciones.charAt(0).toUpperCase()}
            {tipo_especificaciones.slice(1).toLowerCase()}
          </strong>
          : {especificaciones.charAt(0).toUpperCase()}
          {especificaciones.slice(1).toLowerCase()}
        </li>
      )}
      <li>
        <strong>En stock: </strong> {cantidad_stock}
      </li>
    </ul>
  );
}

function Contador({ cantidad_stock }: { cantidad_stock: number }) {
  const [cantidad, setCantidad] = useState(1);

  const incrementar = () => {
    setCantidad((prev) => (prev < cantidad_stock ? prev + 1 : prev));
  };

  const decrementar = () => {
    setCantidad((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div className="flex items-center gap-8">
      <strong className="lg:text-[1.2rem] xl:text-2xl">Cantidad: </strong>
      <button
        onClick={decrementar}
        className="bg-contador p-2 rounded-full hover:bg-gray-300 transition-colors w-8 h-8 flex items-center justify-center"
        aria-label="Disminuir cantidad"
      >
        -
      </button>
      <span className="text-xl">{cantidad}</span>
      <button
        onClick={incrementar}
        className="bg-contador p-2 rounded-full hover:bg-gray-300 transition-colors w-8 h-8 flex items-center justify-center"
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  );
}

function FullScreenModal({
  isFullScreen,
  imagen_producto,
  nombre,
  closeFullScreen,
}: any) {
  if (!isFullScreen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={closeFullScreen}
      aria-modal="true"
      role="dialog"
    >
      <img
        src={
          !imagen_producto || imagen_producto === "null"
            ? "https://img.freepik.com/vector-gratis/ilustracion-icono-doodle-engranaje_53876-5596.jpg?semt=ais_hybrid&w=740"
            : imagen_producto
        }
        alt={`Imagen de ${nombre}`}
        className="max-h-[70vh] max-w-[70vw] object-contain rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="absolute top-6 right-6 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-colors"
        onClick={closeFullScreen}
        title="Cerrar"
        aria-label="Cerrar imagen"
      >
        <X className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
}

const ProductDetail = (props: ProductDetailProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const openFullScreen = () => setIsFullScreen(true);
  const closeFullScreen = () => setIsFullScreen(false);

  return (
    <main
      className="relative font-sans bg-white container-padding"
      itemScope
      itemType="https://schema.org/Product"
    >
      <Breadcrumb {...props} isFullScreen={isFullScreen} />
      <div className="flex flex-col lg:flex-row bg-white py-6 sm:py-10 lg:py-15 relative align-middle justify-center font-sans md:gap-10 lg:gap-40">
        <ProductImage
          imagen_producto={props.imagen_producto}
          nombre={props.nombre}
          descuento={props.descuento}
          openFullScreen={openFullScreen}
          isFullScreen={isFullScreen}
        />
        <ProductInfo {...props} />
        <FullScreenModal
          isFullScreen={isFullScreen}
          imagen_producto={props.imagen_producto}
          nombre={props.nombre}
          closeFullScreen={closeFullScreen}
        />
      </div>
    </main>
  );
};

export default ProductDetail;
