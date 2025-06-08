import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Asegúrate que esté bien importado
import { RowDataPacket } from "mysql2";

interface ResultadoRow extends RowDataPacket {
  resultado: string; // Tu SP retorna JSON como string
}

export async function GET(
  request: Request,
  { params }: { params: { level: string; id: string } }
) {
  const level = parseInt(params.level);
  const id = parseInt(params.id);

  if (isNaN(level) || isNaN(id)) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  try {
    const [rows] = await db.query<ResultadoRow[]>(
      "CALL obtener_categorias_json(?, ?)",
      [level, id]
    );
    console.log(JSON.stringify(rows, null, 2));


    // El resultado del SP estará dentro del primer array → primer objeto → 'resultado'
    const jsonResult = rows[0][0]?.resultado;

    // Si ya es objeto, úsalo tal cual
    const data = typeof jsonResult === "string"
      ? JSON.parse(jsonResult)
      : jsonResult ?? [];

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return NextResponse.json(
      { error: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}
