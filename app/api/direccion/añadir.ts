// /pages/api/direccion/añadir.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Ruta a tu base de datos
import { RowDataPacket } from "mysql2";

// Definir la estructura para los datos que recibimos
interface Direccion {
  piso: string;
  lote: string;
  calle: string;
  distrito: string;
  provincia: string;
  departamento: string;
  codigo_postal: string;
  usuario_id: string;
}

export async function POST(request: Request) {
  try {
    const data: Direccion = await request.json();

    // Realizamos la inserción en la base de datos
    const query = `
      INSERT INTO direccion (piso, lote, calle, id_distrito, codigo_postal)
      VALUES (?, ?, ?, 
        (SELECT id FROM distrito WHERE nombre = ? LIMIT 1), ?)
    `;

    const [results] = await db.query<RowDataPacket[]>(query, [
      data.piso,
      data.lote,
      data.calle,
      data.distrito,
      data.codigo_postal,
    ]);

    // Si la inserción es exitosa, se devuelve una respuesta
    return NextResponse.json({ success: true, message: "Dirección añadida con éxito" });
  } catch (error) {
    console.error("Error al añadir dirección:", error);
    return NextResponse.json(
      { error: "Error al añadir la dirección" },
      { status: 500 }
    );
  }
}
