import { NextResponse } from "next/server";
import {db} from "@/lib/db";
import type { CategoriaNivel2 } from "@/app/types/categoria";
import { RowDataPacket } from "mysql2";

interface CategoriaNivel3Row extends RowDataPacket {
  id: number;
  nombre_categoria: string;
  id_categoria_nivel_2: number;
}


export async function GET() {
  try {
    const [rows] = await db.query<CategoriaNivel3Row[]>(
      "SELECT id, nombre_categoria, id_categoria_nivel_2 FROM ecommerce.categoria_nivel_3"
    );

    const categorias: CategoriaNivel2[] = rows.map((row) => ({
      id: row.id,
      nombre: row.nombre_categoria,
      id_categoria_nivel_2: row.id_categoria_nivel_2,
    }));

    return NextResponse.json(categorias);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}