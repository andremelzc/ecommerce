// app/api/cart/addOrUpdate/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '../../auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await auth();
    // 1) Obtenemos el body con los datos del item
    const {
      productId,
      nombre,
      descripcion,
      image_producto,
      cantidad,
      precio,
    } = await req.json();

    // 2) Simulamos userId 
    const userId = session?.user.id;

    // 3) Obtenemos el id del carrito para este usuario. Asumimos que
    //    en carrito_compras ya existe una fila c.id para c.id_usuario = 1.
    //    Si no existe, tendrías que crearla primero con INSERT.
    const [carritoRows] = await db.query(
      `SELECT id FROM carrito_compras WHERE id_usuario = ?`,
      [userId]
    );
    if ((carritoRows as any[]).length === 0) {
      // Si el usuario no tiene carrito, lo creamos:
      const [insertResult] = await db.query(
        `INSERT INTO carrito_compras (id_usuario) VALUES (?)`,
        [userId]
      );
      // @ts-ignore
      carritoRows.push({ id: (insertResult as any).insertId });
    }
    const carritoId = (carritoRows as any[])[0].id as number;

    // 4) Verificamos si ya existe un registro en carrito_compras_producto_especifico
    const [existingRows] = await db.query(
      `SELECT cantidad FROM carrito_compras_producto_especifico
       WHERE id_carrito = ? AND id_producto_especifico = ?`,
      [carritoId, productId]
    );

    if ((existingRows as any[]).length > 0) {
      // Ya existe → actualizamos la cantidad sumando
      await db.query(
        `UPDATE carrito_compras_producto_especifico
         SET cantidad = cantidad + ?
         WHERE id_carrito = ? AND id_producto_especifico = ?`,
        [cantidad, carritoId, productId]
      );
    } else {
      // No existe → insertamos una nueva línea
      await db.query(
        `INSERT INTO carrito_compras_producto_especifico
         (id_carrito, id_producto_especifico, cantidad)
         VALUES (?, ?, ?)`,
        [carritoId, productId, cantidad]
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error en POST /api/cart/addOrUpdate:', err);
    return NextResponse.json(
      { error: 'Error al agregar/actualizar ítem en el carrito' },
      { status: 500 }
    );
  }
}
