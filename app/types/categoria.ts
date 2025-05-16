export interface CategoriaNivevl1 {
    id: number;
    nombre: string;
    subcategorias?: CategoriaNivevl2[];
}

export interface CategoriaNivevl2 {
    id: number;
    nombre: string;
    subcategorias?: CategoriaNivevl3[];
}

export interface CategoriaNivevl3 {
    id: number;
    nombre: string;
}