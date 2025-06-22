// /pages/api/direccion/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";  // Asegúrate de que la ruta sea correcta
import { RowDataPacket } from "mysql2";

// Interfaz para las direcciones
interface Direccion extends RowDataPacket {
  id: number;
  piso: string;
  lote: string;
  calle: string;
  id_distrito: string;
  codigo_postal: string;
  isPrimary: boolean;
}

export async function GET(request: Request) {
  // Usamos URLSearchParams para obtener el parámetro de la consulta correctamente
  const url = new URL(request.url);
  const usuario_id = url.searchParams.get("usuario_id");

  console.log("usuario_id recibido:", usuario_id); // Verifica que el parámetro esté siendo recibido correctamente

  // Verificar si el usuario_id está presente en la consulta
  if (!usuario_id) {
    return NextResponse.json({ error: "El usuario_id es requerido." }, { status: 400 });
  }

  const query = `
    SELECT 
      d.id, d.piso, d.lote, d.calle, di.nombre AS distrito, 
      p.nombre AS provincia, de.nombre AS departamento, d.codigo_postal 
    FROM direccion_usuario AS du
    JOIN direccion AS d ON du.direccion_id = d.id
    JOIN distrito AS di ON d.id_distrito = di.id
    JOIN provincias AS p ON p.id = di.id_provincia
    JOIN departamento AS de ON de.id = p.departamento_id
    WHERE du.usuario_id = ?
  `;

  try {
    const [results] = await db.query<Direccion[]>(query, [usuario_id]);

    if (results.length === 0) {
      return NextResponse.json({ error: "No se encontraron direcciones para este usuario." }, { status: 404 });
    }

    return NextResponse.json(results); // Retorna las direcciones obtenidas
  } catch (error) {
    console.error("Error al obtener las direcciones:", error);
    return NextResponse.json({ error: "Error al obtener las direcciones" }, { status: 500 });
  }
}
