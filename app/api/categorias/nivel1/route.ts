import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { CategoriaNivel1 } from "@/app/types/categoria";
import { RowDataPacket } from "mysql2";

interface CategoriaNivel1Row extends RowDataPacket {
  id: number;
  nombre: string;
}

export async function GET() {
  try {
    const [rows] = await db.query<CategoriaNivel1Row[]>(
      "SELECT id, nombre_categoria FROM ecommerce.categoria_nivel_1"
    );

    const categorias: CategoriaNivel1[] = rows.map((row) => ({
      id: row.id,
      nombre: row.nombre_categoria,
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
