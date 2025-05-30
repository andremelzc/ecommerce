import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  let sql = `
    select pe.id_producto as id, pe.SKU, pe.cantidad_stock, pe.imagen_producto, pe.precio, p.nombre, p.descripcion, vo.valor as especificaciones, v.nombre as tipo_especificaciones, c3.nombre_categoria as nivel_3, c2.nombre_categoria as nivel_2, c1.nombre_categoria as nivel_1, ppe.porcentaje_desc as descuento, pro.nombre as nombre_promocion
    from producto_especifico as pe
    join producto as p
    on p.id = pe.id_producto
    left join combinaciones_producto as cp
    on pe.id_producto = cp.id_producto_especifico
    left join variacion_opcion as vo
    on cp.id_producto_especifico = vo.id_variacion
    left join variacion as v
    on v.id = vo.id_variacion
    left join categoria_nivel_3 as c3
    on v.id_categoria_3 = c3.id
    left join categoria_nivel_2 as c2
    on v.id_categoria_2 = c2.id
    left join categoria_nivel_1 as c1
    on v.id_categoria_1 = c1.id
    left join promocion_producto_especifico as ppe
    on ppe.id_producto_especifico = pe.id
    left join promocion as pro
    on pro.id = ppe.id_promocion
    where p.id = ${db.escape(parseInt(id))}
    order by pe.precio desc
    limit 1;
   `;

  try {
    const [rows] = await db.query(sql);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return NextResponse.json(
      { error: "Error al obtener producto" },
      { status: 500 }
    );
  }
}
