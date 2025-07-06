import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { generarBoletaPDF } from "@/lib/pdf";
import nodemailer from "nodemailer";

interface InfoBoletaRow extends RowDataPacket {
  r_nombre: string;
  r_identificacion: string;
  r_email: string;
  r_tipo_pago: string;
  r_piso: string | null;
  r_lote: string | null;
  r_calle: string | null;
  r_distrito: string;
  r_provincia: string;
  r_departamento: string;
  r_pais: string;
  r_metodo_envio: string;
  r_estado: string;
}

export async function POST(request: Request) {
  try {
    const {
      usuarioId,
      metodoPagoId,
      direccionEnvioId,
      metodoEnvioId,
      estadoOrdenId,
      items,
      subtotal,
      costoEnvio,
      total
    } = await request.json();

    //  Llamada al SP para obtener datos de la boleta
    const [rows] = await db.query<InfoBoletaRow[]>(
      "CALL sp_obtener_datos_boleta(?,?,?,?,?)",
      [usuarioId, metodoPagoId, direccionEnvioId, metodoEnvioId, estadoOrdenId]
    );
    const info = rows[0];

    //  Generar PDF
    const pdfBuffer = await generarBoletaPDF(
      info,
      items,
      subtotal,
      costoEnvio,
      total
    );

    //  Enviar PDF por correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: info.r_email,
      subject: "Tu boleta de venta",
      text: "Adjuntamos tu boleta en PDF.",
      attachments: [
        { filename: "boleta.pdf", content: pdfBuffer }
      ]
    });

    return NextResponse.json({ message: "Boleta generada y enviada." });
  } catch (error) {
    console.error("Error en POST /api/generar-boleta:", error);
    return NextResponse.json(
      { error: "Error interno al generar o enviar la boleta" },
      { status: 500 }
    );
  }
}
