import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';
import { InfoBoleta } from '@/app/types/infoBoleta';

/**
 * Genera un PDF de boleta usando PDFKit con estilo corporativo de CompX.
 */
export async function generarBoletaPDF(
  info: InfoBoleta,
  items: { nombre: string; cantidad: number; precioUnitario: number }[],
  subtotal: number,
  costoEnvio: number,
  total: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Paleta de colores
    const colors = {
      background: '#ffffff',
      foreground: '#171717',
      ebony50: '#f3f6fb',
      ebony100: '#e3ebf6',
      ebony200: '#cdddf0',
      ebony800: '#3f538e',
      ebony900: '#374771',
    };

    console.log("Route - InfoBoleta:", info);
    console.log("Route - Items:", items);
    console.log("Route - Subtotal, CostoEnvío, Total:", subtotal, costoEnvio, total);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('error', reject);
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    // Registrar fuentes Roboto
    const fontsDir = path.join(process.cwd(), 'public', 'fonts');
    doc.registerFont('Roboto', path.join(fontsDir, 'Roboto-VariableFont_wdth,wght.ttf'));
    doc.registerFont('Roboto-Italic', path.join(fontsDir, 'Roboto-Italic-VariableFont_wdth,wght.ttf'));

    // Fondo
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(colors.background);

    // Header: logo y título
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 40, { width: 80 });
    }
    const titleY = 60;
    doc.fillColor(colors.ebony900)
      .font('Roboto')
      .fontSize(20)
      .text('COMPX - BOLETA DE VENTA', 140, titleY);

    // Fecha y hora de emisión
    const now = new Date();
    const fecha = now.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const hora = now.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const fechaHoraTexto = `Fecha: ${fecha} ${hora}`;
    doc.font('Roboto-Italic')
      .fontSize(10)
      .fillColor(colors.ebony800)
      .text(fechaHoraTexto, doc.page.width - 150, titleY + 20, { align: 'right' });

    // Datos del cliente
    const clientY = titleY + 60;
    doc.roundedRect(50, clientY, doc.page.width - 100, 60, 5)
      .fill(colors.ebony50);
    doc.fillColor(colors.foreground)
      .font('Roboto')
      .fontSize(10)
      .text(`Cliente: ${info.r_nombre}`, 60, clientY + 10)
      .text(`Identificación: ${info.r_identificacion}`, 60, clientY + 25)
      .text(`Email: ${info.r_email}`, 60, clientY + 40);

    // Detalles del pedido
    const detailsY = clientY + 80;
    doc.font('Roboto-Italic')
      .fontSize(10)
      .fillColor(colors.ebony900)
      .text('Detalles de Pedido', 50, detailsY);
    doc.font('Roboto')
      .fontSize(10)
      .fillColor(colors.foreground)
      .text(`Tipo de pago: ${info.r_tipo_pago}`)
      .text(`Método de envío: ${info.r_metodo_envio}`)
      .text(`Estado: ${info.r_estado}`);

    // Tabla de productos
    doc.moveDown(1);
    const tableTop = doc.y;
    const cols = { producto: 50, cantidad: 300, precio: 370, subtotal: 440 };
    const lineHeight = 20;

    // Encabezados
    doc.font('Roboto-Italic')
      .fontSize(10)
      .fillColor(colors.ebony800)
      .text('Producto', cols.producto, tableTop)
      .text('Cant.', cols.cantidad, tableTop)
      .text('P.Unit.', cols.precio, tableTop)
      .text('Subt.', cols.subtotal, tableTop);
    doc.moveTo(50, tableTop + 15)
      .lineTo(doc.page.width - 50, tableTop + 15)
      .stroke(colors.ebony200);

    // Filas
    let rowY = tableTop + 20;
    items.forEach((item, i) => {
      if (i % 2 === 0) {
        doc.rect(50, rowY - 2, doc.page.width - 100, lineHeight).fill(colors.ebony100);
      }
      const subTotalItem = (item.precioUnitario * item.cantidad).toFixed(2);
      doc.fillColor(colors.foreground)
        .font('Roboto')
        .fontSize(10)
        .text(item.nombre, cols.producto, rowY)
        .text(item.cantidad.toString(), cols.cantidad, rowY)
        .text(item.precioUnitario.toFixed(2), cols.precio, rowY)
        .text(subTotalItem, cols.subtotal, rowY);
      rowY += lineHeight;
    });

    // Totales
    const afterTableY = rowY + 10;
    doc.roundedRect(50, afterTableY, doc.page.width - 100, 60, 5)
      .stroke(colors.ebony200);
    const labelX = 360;
    doc.font('Roboto-Italic')
      .fontSize(10)
      .fillColor(colors.ebony900)
      .text('Subtotal:', labelX, afterTableY + 10)
      .text('Costo Envío:', labelX, afterTableY + 25)
      .text('Total:', labelX, afterTableY + 40);
    const valueX = doc.page.width - 150;
    doc.font('Roboto')
      .fontSize(10)
      .fillColor(colors.foreground)
      .text(`S/ ${subtotal.toFixed(2)}`, valueX, afterTableY + 10, { width: 100, align: 'right' })
      .text(`S/ ${costoEnvio.toFixed(2)}`, valueX, afterTableY + 25, { width: 100, align: 'right' })
      .fontSize(12)
      .text(`S/ ${total.toFixed(2)}`, valueX, afterTableY + 40, { width: 100, align: 'right' });

    // Footer
    const footerY = doc.page.height - 80;
    doc.moveTo(50, footerY)
      .lineTo(doc.page.width - 50, footerY)
      .stroke(colors.ebony200);
    doc.font('Roboto')
      .fontSize(8)
      .fillColor(colors.ebony900)
      .text(
        'Tlf: +51 999 999 999   •   correo: compx.services@gmail.com   •   web: compx.com.pe   •   Instagram: @compx',
        50,
        footerY + 10,
        { align: 'center', width: doc.page.width - 100 }
      );

    doc.end();
  });
}
