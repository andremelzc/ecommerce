// app/api/product/stock/[productId]/route.ts

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Context {
  params: { productId: string };
}

export async function GET(_req: Request, context: Context) {
  try {
    const productId = parseInt(context.params.productId, 10);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'ID de producto inválido' },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      `SELECT Cantidad_stock FROM producto_especifico WHERE id = ?`,
      [productId]
    );

    const result = rows as any[];

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      Cantidad_stock: result[0].Cantidad_stock,
    });
  } catch (err) {
    console.error('Error al obtener stock:', err);
    return NextResponse.json(
      { error: 'Error del servidor al consultar stock' },
      { status: 500 }
    );
  }
}
