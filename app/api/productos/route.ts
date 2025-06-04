import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const onlyPromo = params.get("onlyPromo") ?? "";
  const promocionId = params.get("promocionId") ?? "";
  const minPrecio = params.get("minPrecio") ?? "";
  const maxPrecio = params.get("maxPrecio") ?? "";
  const limit = params.get("limit") ?? "";
  const categoryId = params.get("categoryId") ?? "";
  const categoryLevel = params.get("categoryLevel") ?? "";

  // Si queremos productos que tengan alguna promoción o no
  const joinPromo =
    onlyPromo === "true"
      ? "INNER JOIN Ecommerce.promocion_producto_especifico AS ppe ON pe.id = ppe.id_producto_especifico"
      : "LEFT JOIN Ecommerce.promocion_producto_especifico AS ppe ON pe.id = ppe.id_producto_especifico";

  // Si se nos especifica el límite de productos a devolver
  const limitSentence = limit
    ? `\nORDER BY p.id \nLIMIT ${parseInt(limit)}`
    : "";

  const catId = parseInt(categoryId);
  const catLevel = parseInt(categoryLevel);

  const joinCategory =
    "INNER JOIN producto_categoria as pc ON p.id = pc.id_producto";

  // La query
  let sql = `
    WITH max_precios AS (
      SELECT 
        id_producto, 
        MAX(precio) AS precio_max
      FROM Ecommerce.producto_especifico
      GROUP BY id_producto
    )

    SELECT
      p.id                     AS producto_id,
      p.nombre,
      p.descripcion,
      pe.imagen_producto,
      pe.precio,               -- aquí es el precio máximo
      ppe.porcentaje_desc

    FROM Ecommerce.producto AS p
    INNER JOIN Ecommerce.producto_especifico AS pe 
    ON p.id = pe.id_producto
    INNER JOIN max_precios AS mp
    ON pe.id_producto = mp.id_producto
    AND pe.precio       = mp.precio_max

    ${joinPromo}

    ${!isNaN(catLevel) && !isNaN(catId) ? `\n${joinCategory}` : ""}
      
    WHERE pe.id = (
      SELECT MIN(ID) 
      FROM Ecommerce.producto_especifico
      WHERE id_producto = mp.id_producto
      AND precio = mp.precio_max
      )

   `;

  // Añadimos filtros
  const conditions: string[] = [];
  if (promocionId) {
    conditions.push(`ppe.id_promocion = ${db.escape(parseInt(promocionId))}`);
  }
  if (minPrecio) {
    conditions.push(`pe.precio          >= ${db.escape(minPrecio)}`);
  }
  if (maxPrecio) {
    conditions.push(`pe.precio          <= ${db.escape(maxPrecio)}`);
  }
  if (!isNaN(catLevel) && !isNaN(catId)) {
    conditions.push(
      `pc.id_cat_n${categoryLevel} = ${db.escape(parseInt(categoryId))}`
    );
  }
  if (conditions.length > 0) {
    sql += `\nAND ${conditions.join(" AND ")}`;
  }

  sql += limitSentence;

  try {
    const [rows] = await db.query(sql);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}
