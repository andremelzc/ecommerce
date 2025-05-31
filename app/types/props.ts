export interface DrawerProps  {
  isOpen: boolean;
  onClose: () => void;
};

export interface ProductSectionProps {
  title: string;
  filterType: 'bestSellers' | 'newArrivals' | 'onSale' | 'byCategory' | 'byPromotion' | 'onlyPromotions' | '' | 'all';
  categoryId?: number;
  categoryLevel?: number;
  promotionId?: number;
  asCarousel?:  boolean;
  asGrid?: boolean;
  gridColumns?: number;
  limit?: number;
}

export interface ProductCardProps {
  id?: number;
  producto_id?: number; 
  nombre: string;
  descripcion?: string;
  imagen_producto: string;
  precio: number; // Opcional si no siempre se muestra el precio
  descuento?: number; // Opcional si no siempre se muestra el descuento
  porcentaje_desc?: number; // Opcional si no siempre se muestra el porcentaje de descuento
}

export interface ProductListProps {
  productos: ProductCardProps[];
  horizontal?: boolean;
}

export interface ProductCarouselProps {
  productos: ProductCardProps[];
}

export interface ProductDetailProps extends ProductCardProps {
  SKU: string;
  cantidad_stock: number;
  imagen_producto: string;
  descripcion: string; // sobreescribe la obligatoriedad de descripcion
  especificaciones: string | null;
  tipo_especificaciones: string | null;
  nivel_1: string;
  nivel_2: string | null;
  nivel_3: string | null;
  nombre_promocion: string;
}