import PDFDocument from 'pdfkit';
import { InfoBoleta } from '@/app/types/infoBoleta';

/**
 * Genera un PDF de boleta usando PDFKit.
 * @param info Datos del cliente y pedido provenientes del SP.
 * @param items Array de productos con nombre, cantidad y precio unitario.
 * @param subtotal Monto subtotal de la orden.
 * @param costoEnvio Costo de envío.
 * @param total Monto total (subtotal + envío).
 * @returns Buffer con el contenido del PDF.
 */
export async function generarBoletaPDF(
  info: InfoBoleta,
  items: { nombre: string; cantidad: number; precioUnitario: number }[],
  subtotal: number,
  costoEnvio: number,
  total: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // — Cabecera —
    doc
      .fontSize(18)
      .text('BOLETA DE VENTA', { align: 'center' })
      .moveDown();

    // — Datos del cliente —
    doc
      .fontSize(10)
      .text(`Cliente: ${info.r_nombre}`)
      .text(`Identificación: ${info.r_identificacion}`)
      .text(`Email: ${info.r_email}`)
      .moveDown();

    // — Detalles del pedido —
    doc
      .font('Helvetica-Bold')
      .text('Detalles de Pedido')
      .moveDown(0.5)
      .font('Helvetica')
      .text(`Tipo de pago: ${info.r_tipo_pago}`)
      .text(`Método de envío: ${info.r_metodo_envio}`)
      .text(`Estado: ${info.r_estado}`)
      .moveDown();

    // — Dirección desglosada —
    doc
      .font('Helvetica-Bold')
      .text('Dirección')
      .moveDown(0.2)
      .font('Helvetica')
      .list([
        `Piso: ${info.r_piso ?? ''}`,
        `Lote: ${info.r_lote ?? ''}`,
        `Calle: ${info.r_calle ?? ''}`,
        `Distrito: ${info.r_distrito}`,
        `Provincia: ${info.r_provincia}`,
        `Departamento: ${info.r_departamento}`,
        `País: ${info.r_pais}`
      ])
      .moveDown();

    // — Tabla de productos —
    const startY = doc.y;
    const cols = { producto: 50, cantidad: 300, precio: 370, subtotal: 450 };

    // Encabezados
    doc
      .font('Helvetica-Bold')
      .text('Producto', cols.producto, startY)
      .text('Cant.', cols.cantidad, startY)
      .text('P.Unit.', cols.precio, startY)
      .text('Subt.', cols.subtotal, startY)
      .moveDown(0.5);

    // Filas
    doc.font('Helvetica');
    items.forEach((item, i) => {
      const y = startY + 20 + i * 20;
      const sub = (item.precioUnitario * item.cantidad).toFixed(2);
      doc
        .text(item.nombre, cols.producto, y, { width: cols.cantidad - cols.producto })
        .text(item.cantidad.toString(), cols.cantidad, y)
        .text(item.precioUnitario.toFixed(2), cols.precio, y)
        .text(sub, cols.subtotal, y);
    });

    doc.moveDown(items.length * 0.5 + 1);

    // — Totales —
    doc
      .font('Helvetica-Bold')
      .text(`Subtotal: S/ ${subtotal.toFixed(2)}`, { align: 'right' })
      .text(`Costo Envío: S/ ${costoEnvio.toFixed(2)}`, { align: 'right' })
      .text(`Total: S/ ${total.toFixed(2)}`, { align: 'right' });

    doc.end();
  });
}
