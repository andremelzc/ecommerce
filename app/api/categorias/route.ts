import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import type { CategoriaNivel1 } from "@/app/types/categoria";
import { CategoriaNivel2 } from "@/app/types/categoria";
import { CategoriaNivel3 } from "@/app/types/categoria";

type Data = RowDataPacket & {
  id_n1: number;
  nombre_n1: string;
  id_n2: number | null;
  nombre_n2: string | null;
  id_n3: number | null;
  nombre_n3: string | null;
};

function anidarCategorias(rows: Data[]): CategoriaNivel1[] {
  const mapNivel1 = new Map<number, CategoriaNivel1>();

  for (const row of rows) {
    // Nivel 1
    let nivel1 = mapNivel1.get(row.id_n1);
    if (!nivel1) {
      nivel1 = { id: row.id_n1, nombre: row.nombre_n1, subcategorias: [] };
      mapNivel1.set(row.id_n1, nivel1);
    }

    // Nivel 2 (si existe)
    if (row.id_n2 !== null && row.nombre_n2 !== null) {
      let nivel2 = nivel1.subcategorias!.find((n2) => n2.id === row.id_n2);
      if (!nivel2) {
        nivel2 = { id: row.id_n2, nombre: row.nombre_n2, subcategorias: [] };
        nivel1.subcategorias!.push(nivel2);
      }

      // Nivel 3 (si existe)
      if (row.id_n3 !== null && row.nombre_n3 !== null) {
        const existeNivel3 = nivel2.subcategorias!.some(
          (n3) => n3.id === row.id_n3
        );
        if (!existeNivel3) {
          nivel2.subcategorias!.push({ id: row.id_n3, nombre: row.nombre_n3 });
        }
      }
    }
  }

  return Array.from(mapNivel1.values());
}

export async function GET() {
  try {
    const [rows] = await db.query<
      Data[]
    >(`SELECT n1.id as id_n1, n1.nombre_categoria AS nombre_n1,
       n2.id AS id_n2, n2.nombre_categoria AS nombre_n2,
       n3.id AS id_n3, n3.nombre_categoria AS nombre_n3
       FROM categoria_nivel_1 n1
       LEFT JOIN categoria_nivel_2 n2 ON n2.id_categoria_nivel_1 = n1.id
       LEFT JOIN categoria_nivel_3 n3 ON n3.id_categoria_nivel_2 = n2.id
       ORDER BY n1.id, n2.id, n3.id`);

    const categoriasAnidadas = anidarCategorias(rows);
    return NextResponse.json(categoriasAnidadas);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}
