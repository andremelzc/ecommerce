import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Asegúrate que esté bien importado
import { RowDataPacket } from "mysql2";

export async function POST(request:Request){
    //Que recibira este post? RPTA: Un formato JSON de register
    const data = await request.json();
    try{
        console.log(data);
        return NextResponse.json("registrando...")
        /*
        const [rows] = await db.query<>(
            "CALL obtener_categorias_json(?, ?)",
            [nombre,apellido,tipoId,ID,email,telefono,contrasena]
          );
        */
    }
    catch{

    }

}
