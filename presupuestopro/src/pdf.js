import { usd } from "./formato.js";

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export function fechaLarga(f) {
  return `${f.getDate()} de ${MESES[f.getMonth()]} de ${f.getFullYear()}`;
}

export function generarPdf({ negocio, cliente, lineas, calculo, numero, fecha }) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 15;

  if (negocio.logo) {
    try {
      const fmt = negocio.logo.startsWith("data:image/png") ? "PNG" : "JPEG";
      const p = doc.getImageProperties(negocio.logo);
      const alto = 20;
      doc.addImage(negocio.logo, fmt, 15, y, (p.width / p.height) * alto, alto);
      y += alto + 5;
    } catch { /* sin logo si la imagen es inválida */ }
  }
  doc.setFont("helvetica", "bold").setFontSize(14).text(negocio.nombre, 15, y);
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(`RUC: ${negocio.identificacion}`, 15, (y += 5));
  doc.text(negocio.contacto, 15, (y += 5));
  doc.text(negocio.direccion, 15, (y += 5));

  doc.setFont("helvetica", "bold").setFontSize(16).text(`PRESUPUESTO ${numero}`, 195, 20, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(10);
  doc.text(`Fecha de emisión: ${fechaLarga(fecha)}`, 195, 27, { align: "right" });

  y += 12;
  doc.setFont("helvetica", "bold").text("Cliente", 15, y);
  doc.setFont("helvetica", "normal");
  doc.text(cliente.nombre, 15, (y += 5));
  doc.text(`${cliente.tipo === "ruc" ? "RUC" : "Cédula"}: ${cliente.identificacion}`, 15, (y += 5));

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Servicio", 15, y);
  doc.text("Precio/hora", 120, y, { align: "right" });
  doc.text("Horas", 150, y, { align: "right" });
  doc.text("Subtotal", 195, y, { align: "right" });
  doc.line(15, y + 2, 195, y + 2);
  doc.setFont("helvetica", "normal");
  lineas.forEach((l, i) => {
    y += 7;
    if (y > 270) { doc.addPage(); y = 20; }
    doc.text(l.nombre, 15, y, { maxWidth: 85 });
    doc.text(usd(Math.round(l.precioHora * 100)), 120, y, { align: "right" });
    doc.text(String(l.horas), 150, y, { align: "right" });
    doc.text(usd(calculo.subtotales[i]), 195, y, { align: "right" });
  });

  y += 12;
  if (y > 250) { doc.addPage(); y = 20; }
  const fila = (t, v, neg) => {
    doc.setFont("helvetica", neg ? "bold" : "normal");
    doc.text(t, 150, y, { align: "right" });
    doc.text(usd(v), 195, y, { align: "right" });
    y += 6;
  };
  fila("Base imponible", calculo.base);
  fila("IVA", calculo.iva);
  fila("Retención", calculo.retencion);
  fila("TOTAL", calculo.total, true);

  y += 8;
  doc.setFont("helvetica", "italic").text("Válido por 30 días desde la fecha de emisión.", 15, y);
  doc.save(`Presupuesto-${numero}.pdf`);
}
