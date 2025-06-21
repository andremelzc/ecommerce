import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '../../auth/[...nextauth]/route';

/**
 * Definimos una interfaz explícita para el contexto que recibimos.
 * No destructuramos { params } en la firma; recibimos un objeto `context`
 * y luego extraemos `params` dentro de la función.
 */
interface Context {
  params: Promise<{ productId: string }>;
}

/**
 * DELETE /api/cart/{productId}
 * Elimina ese producto específico del carrito del usuario.
 */
export async function DELETE(
  request: Request,
  context: Context
) {
  const session = await auth();
  try {
    // Extraemos params haciendo await sobre context.params
    const paramsData = await context.params;
    const productId = parseInt(paramsData.productId, 10);

    // Simulamos usuario autenticado con id 
    const userId = session?.user.id;

    // 1) Obtener el id del carrito para userId 
    const [carritoRows] = await db.query(
      `SELECT id FROM carrito_compras WHERE id_usuario = ?`,
      [userId]
    );
    if ((carritoRows as any[]).length === 0) {
      return NextResponse.json(
        { error: 'El usuario no tiene carrito' },
        { status: 400 }
      );
    }
    const carritoId = (carritoRows as any[])[0].id as number;

    // 2) Borrar la línea en carrito_compras_producto_especifico
    await db.query(
      `DELETE FROM carrito_compras_producto_especifico 
       WHERE id_carrito = ? AND id_producto_especifico = ?`,
      [carritoId, productId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en DELETE /api/cart/[productId]:', error);
    return NextResponse.json(
      { error: 'Error al eliminar ítem del carrito' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cart/{productId}
 * Body esperado: { quantity: number }
 * Actualiza la cantidad de ese producto en el carrito.
 */
export async function PATCH(
  request: Request,
  context: Context
) {
  try {
    // Extraemos params haciendo await sobre context.params
    const paramsData = await context.params;
    const productId = parseInt(paramsData.productId, 10);

    // Leemos el body para extraer quantity
    const { quantity } = await request.json(); // { quantity: número }

    if (typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { error: 'La cantidad debe ser un número mayor o igual a 1' },
        { status: 400 }
      );
    }

    // Simulamos usuario autenticado con id = 1
    const userId = 1;

    // 1) Obtener id del carrito para userId = 1
    const [carritoRows] = await db.query(
      `SELECT id FROM carrito_compras WHERE id_usuario = ?`,
      [userId]
    );
    if ((carritoRows as any[]).length === 0) {
      return NextResponse.json(
        { error: 'El usuario no tiene carrito' },
        { status: 400 }
      );
    }
    const carritoId = (carritoRows as any[])[0].id as number;

    // 2) Actualizar la cantidad en carrito_compras_producto_especifico
    await db.query(
      `UPDATE carrito_compras_producto_especifico
       SET cantidad = ?
       WHERE id_carrito = ? AND id_producto_especifico = ?`,
      [quantity, carritoId, productId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en PATCH /api/cart/[productId]:', error);
    return NextResponse.json(
      { error: 'Error al actualizar cantidad del carrito' },
      { status: 500 }
    );
  }
}
