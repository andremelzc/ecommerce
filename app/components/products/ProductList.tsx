"use client";
import React from "react";
import ProductCard from "./ProductCard";
import Pagination from "../ui/Pagination";
import { ProductListProps } from "@/app/types/props";
import { usePagination } from "@/app/hooks/usePagination";

const ProductList = ({ productos, horizontal, itemsPage }: ProductListProps) => {
  const pagination = usePagination({
    data: productos,
    itemsPerPage: itemsPage ?? 20
  });

  const containerClass = horizontal
    ? "flex overflow-x-auto gap-4"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-8";

  return (
    <div className="space-y-6">
      {/* Lista de productos */}
      <div className={containerClass}>
        {pagination.paginatedData.map((producto) => (
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

      {/* Paginación reutilizable */}
      {!horizontal && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          onNextPage={pagination.nextPage}
          onPrevPage={pagination.prevPage}
          onGoToPage={pagination.goToPage}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          totalItems={pagination.totalItems}
          itemName="productos"
        />
      )}
    </div>
  );
};

export default ProductList;