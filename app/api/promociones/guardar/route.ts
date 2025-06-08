import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // tu conexión mysql2 pool

interface PromocionRequest {
  // Datos básicos de la promoción
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  img_promocional?: string;
  porcentaje_descuento: number;
  
  // Configuración de aplicación
  destino: {
    tipo: 'CATEGORIA' | 'PRODUCTO';
    ids: number[];
  };
  subcategorias?: number[]; // IDs de subcategorías seleccionadas
}

export async function POST(request: Request) {
  console.log("🚀 API llamada recibida");
  
  try {
    const body: PromocionRequest = await request.json();
    console.log("📝 Body recibido:", JSON.stringify(body, null, 2));
    
    // Validaciones básicas
    if (!body.nombre || !body.descripcion || !body.fecha_inicio || !body.fecha_fin) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: nombre, descripcion, fecha_inicio, fecha_fin" },
        { status: 400 }
      );
    }

    if (!body.porcentaje_descuento || body.porcentaje_descuento <= 0 || body.porcentaje_descuento > 100) {
      return NextResponse.json(
        { error: "El porcentaje de descuento debe estar entre 1 y 100" },
        { status: 400 }
      );
    }

    // Validar fechas
    const fechaInicio = new Date(body.fecha_inicio);
    const fechaFin = new Date(body.fecha_fin);
    
    if (fechaInicio >= fechaFin) {
      return NextResponse.json(
        { error: "La fecha de inicio debe ser anterior a la fecha de fin" },
        { status: 400 }
      );
    }

    const connection = await db.getConnection();
    console.log("🔌 Conexión a BD obtenida");
    
    try {
      await connection.beginTransaction();
      console.log("🔄 Transacción iniciada");

      if (body.destino.tipo === 'CATEGORIA') {
        console.log("📂 Procesando promoción por categorías");
        // Aplicar promoción por categorías (subcategorías)
        await aplicarPromocionPorCategorias(connection, body);
      } else if (body.destino.tipo === 'PRODUCTO') {
        console.log("📦 Procesando promoción por productos");
        // Aplicar promoción a productos específicos
        await aplicarPromocionPorProductos(connection, body);
      } else {
        throw new Error("Tipo de destino no válido");
      }

      await connection.commit();
      
      return NextResponse.json({
        success: true,
        message: "Promoción creada exitosamente",
        data: {
          nombre: body.nombre,
          tipo: body.destino.tipo,
          aplicadoA: body.destino.tipo === 'CATEGORIA' 
            ? `${body.subcategorias?.length || 0} subcategorías`
            : `${body.destino.ids.length} productos`
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error("Error creando promoción:", error);
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido"
      },
      { status: 500 }
    );
  }
}

async function aplicarPromocionPorCategorias(connection: any, body: PromocionRequest) {
  const subcategoriasIds = body.subcategorias || [];
  
  if (subcategoriasIds.length === 0) {
    throw new Error("Debes seleccionar al menos una subcategoría");
  }

  // Verificar que las subcategorías existen
  const subcategoriasQuery = `
    SELECT id 
    FROM categoria_nivel_2 
    WHERE id IN (${subcategoriasIds.map(() => '?').join(',')})
  `;
  
  const [subcategorias] = await connection.execute(subcategoriasQuery, subcategoriasIds);
  
  if (subcategorias.length !== subcategoriasIds.length) {
    throw new Error("Algunas subcategorías especificadas no existen");
  }

  // Convertir array de IDs a string separado por comas
  const idsString = subcategoriasIds.join(',');
  
  // Una sola llamada para crear UNA promoción aplicada a MÚLTIPLES categorías
  const [resultado] = await connection.execute(
    'CALL AplicarPromocion_Categoria_Optimizada(?, ?, ?, ?, ?, ?, ?)',
    [
      body.nombre,
      body.descripcion,
      body.fecha_inicio,
      body.fecha_fin,
      body.img_promocional || null,
      idsString,  // "1,2,3,4"
      body.porcentaje_descuento
    ]
  );

  console.log("✅ Promoción creada:", resultado[0]);
  return resultado[0]; // { promocion_id: X, productos_afectados: Y }
}

async function aplicarPromocionPorProductos(connection: any, body: PromocionRequest) {
  if (body.destino.ids.length === 0) {
    throw new Error("Debes seleccionar al menos un producto");
  }

  // Verificar que los productos existen
  const productosQuery = `
    SELECT id FROM producto_especifico 
    WHERE id IN (${body.destino.ids.map(() => '?').join(',')})
  `;
  
  const [productos] = await connection.execute(productosQuery, body.destino.ids);
  
  if (productos.length !== body.destino.ids.length) {
    throw new Error("Algunos productos especificados no existen");
  }

  // 1. Crear la promoción
  const [promoResult] = await connection.execute(
    `INSERT INTO promocion (nombre, descripcion, fecha_inicio, fecha_final, img_promocional) 
     VALUES (?, ?, ?, ?, ?)`,
    [
      body.nombre,
      body.descripcion,
      body.fecha_inicio,
      body.fecha_fin,
      body.img_promocional || null
    ]
  );

  const promoId = promoResult.insertId;

  // 2. Asociar productos específicos a la promoción
  const values = body.destino.ids.map(() => '(?, ?, ?)').join(',');
  const params = body.destino.ids.flatMap(productId => [
    productId,
    promoId,
    body.porcentaje_descuento
  ]);

  await connection.execute(
    `INSERT INTO promocion_producto_especifico (id_producto_especifico, id_promocion, porcentaje_desc) 
     VALUES ${values}`,
    params
  );
}

// Endpoint GET para obtener promociones existentes (opcional)
export async function GET() {
  try {
    const [promociones] = await db.execute(`
      SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.fecha_inicio,
        p.fecha_final,
        p.img_promocional,
        COUNT(ppe.id_producto_especifico) as productos_count
      FROM promocion p
      LEFT JOIN promocion_producto_especifico ppe ON p.id = ppe.id_promocion
      WHERE p.fecha_final >= CURDATE()
      GROUP BY p.id, p.nombre, p.descripcion, p.fecha_inicio, p.fecha_final, p.img_promocional
      ORDER BY p.fecha_inicio DESC
    `);

    return NextResponse.json({
      success: true,
      data: promociones
    });

  } catch (error) {
    console.error("Error obteniendo promociones:", error);
    return NextResponse.json(
      { error: "Error obteniendo promociones" },
      { status: 500 }
    );
  }
}