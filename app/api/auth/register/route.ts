import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Asegúrate que esté bien importado
import { RowDataPacket } from "mysql2";

interface estructuraResultado extends RowDataPacket {
    ultimoID: number;
}

export async function POST(request:Request){
    //Que recibira este post? RPTA: Un formato JSON de register
    const data = await request.json();
    
    try{
        console.log(data);
        //Esto quiere decir que el resultado de la query la guardara en esa estructura
        const [rows] = await db.query<estructuraResultado[]>(
            "CALL RegistrarUsuarios(?, ?,?, ?,?, ?,?)",
            [
                data.nombre,
                data.apellido,
                data.tipo_identificacion,
                data.identificacion,
                data.email,
                data.telefono,
                data.contrasena
            ]
          );
        // El resultado del SP estará dentro del primer array → primer objeto → 'resultado'
        const jsonResult = rows[0][0]?.ultimoID;
        console.log(rows[0][0]?.ultimoID);
        return NextResponse.json("Usuario registrado satisfactoriamente")
        
        
    }
    catch{

    }

}
