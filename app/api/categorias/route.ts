import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

type Data = RowDataPacket & {
  id_n1: number;
  nombre_n1: string;
  id_n2: number | null;
  nombre_n2: string | null;
  imagen_n2: string | null;
  id_n3: number | null;
  nombre_n3: string | null;
  imagen_n3: string | null;
};

interface ResultadoRow extends RowDataPacket {
  resultado: string; // Tu SP retorna JSON como string
}

// Se utiliza para carga el contenido al Drawer
export async function GET() {
  try {
    const [rows] = await db.query<ResultadoRow[]>(
      "CALL obtenerCategoriasAnidadas()",
      []
    );    
    console.log(rows);
    const categorias = rows[0][0]?.categorias_json;
    // Si ya es objeto, úsalo tal cual
    const data = typeof categorias === "string"
      ? JSON.parse(categorias)
      : categorias ?? [];

    console.log(data);
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}
