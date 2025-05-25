import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
import type {CategoriaNivel2} from '@/app/types/categoria';
import {RowDataPacket} from 'mysql2';

interface CategoriaNivel2Row extends RowDataPacket {
  id: number;
  nombre: string;
  id_categoria_nivel_1: number;
}

export async function GET() {
  try {
    const [rows] = await db.query<CategoriaNivel2Row[]>(
      'SELECT id, nombre_categoria, id_categoria_nivel_1 FROM ecommerce.categoria_nivel_2'
    );

    const categorias: CategoriaNivel2[] = rows.map((row) => ({
      id: row.id,
      nombre: row.nombre_categoria,
      id_categoria_nivel_1: row.id_categoria_nivel_1,
    }));

    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({error: 'Error fetching categories'}, {status: 500});
  }
}