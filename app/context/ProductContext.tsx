'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos para las variaciones de productos específicos
interface Variacion {
  tipo: string;
  valor: string;
}

// Producto general
interface ProductoGeneral {
  nombre: string;
  descripcion: string;
  imagen_producto: string;
  categoria1: string;
  categoria2: string;
  categoria3: string;
  marca : string;
}

// Producto específico
interface ProductoEspecifico {
  sku: string;
  precio: number | string;
  stock: number | string;
  imagen: string;
  variaciones: Variacion[];
}

// Tipo del contexto
interface ProductContextType {
  productoGeneral: ProductoGeneral;
  setProductoGeneral: React.Dispatch<React.SetStateAction<ProductoGeneral>>;
  productosEspecificos: ProductoEspecifico[];
  setProductosEspecificos: React.Dispatch<React.SetStateAction<ProductoEspecifico[]>>;
}

// Valores por defecto
const defaultProductoGeneral: ProductoGeneral = {
  nombre: '',
  descripcion: '',
  imagen_producto: '',
  categoria1: '',
  categoria2: '',
  categoria3: '',
  marca : '',
};

const defaultProductosEspecificos: ProductoEspecifico[] = [
  {
    sku: '',
    precio: '',
    stock: '',
    imagen: '',
    variaciones: [{ tipo: '', valor: '' }],
  },
];

// Crear contexto
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Proveedor
export function ProductProvider({ children }: { children: ReactNode }) {
  const [productoGeneral, setProductoGeneral] = useState<ProductoGeneral>(defaultProductoGeneral);
  const [productosEspecificos, setProductosEspecificos] = useState<ProductoEspecifico[]>(defaultProductosEspecificos);

  return (
    <ProductContext.Provider
      value={{ productoGeneral, setProductoGeneral, productosEspecificos, setProductosEspecificos }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// Hook para consumir contexto
export function useProduct() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct debe usarse dentro de un ProductProvider');
  }
  return context;
}
