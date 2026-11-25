import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const IGV_RATE = 0.18;

export function calcularMontosCotizacion(quote) {
  const subtotalCalculado = (quote?.products || []).reduce(
    (sum, p) =>
      sum + (Number(p.quantity) || 0) * (Number(p.price) || 0),
    0
  );
  const subtotal = Number(quote?.subtotal ?? subtotalCalculado);
  const igv = Number(quote?.igv ?? subtotal * IGV_RATE);
  const total = Number(quote?.total ?? subtotal + igv);
  return { subtotal, igv, total };
}

export function construirPdfCotizacion(quote) {
  const doc = new jsPDF();
  const { subtotal, igv, total } = calcularMontosCotizacion(quote);

  doc.setFontSize(16);
  doc.setTextColor(23, 50, 76);
  doc.text(`Cotización ${quote.number}`, 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text(`Cliente: ${quote.client?.name || "-"}`, 14, 26);
  doc.text(`Correo: ${quote.client?.email || "-"}`, 14, 32);
  doc.text(`Fecha: ${quote.date || "-"}`, 14, 38);

  const tableBody = (quote.products || []).map((p, idx) => {
    const cant = Number(p.quantity) || 0;
    const precio = Number(p.price) || 0;
    const sub = cant * precio;
    return [
      String(p.item ?? idx + 1),
      String(cant),
      String(p.unit || p.unidadMedida || "UNIDAD"),
      String(p.name || ""),
      `S/ ${precio.toFixed(2)}`,
      `S/ ${sub.toFixed(2)}`,
    ];
  });

  autoTable(doc, {
    startY: 44,
    head: [[
      "Item",
      "Cant. requerida",
      "Unidad de medida",
      "Producto",
      "Precio unit.",
      "Subtotal",
    ]],
    body: tableBody,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [23, 50, 76], textColor: 255 },
  });

  const finalY = (doc.lastAutoTable?.finalY || 60) + 10;
  const xLabel = 125;
  const xValor = 196;

  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text("Subtotal:", xLabel, finalY);
  doc.text(`S/ ${subtotal.toFixed(2)}`, xValor, finalY, { align: "right" });

  doc.text("IGV (18%):", xLabel, finalY + 6);
  doc.text(`S/ ${igv.toFixed(2)}`, xValor, finalY + 6, { align: "right" });

  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.setTextColor(23, 50, 76);
  doc.text("Total:", xLabel, finalY + 14);
  doc.text(`S/ ${total.toFixed(2)}`, xValor, finalY + 14, { align: "right" });

  return doc;
}

export function descargarPdfCotizacion(quote) {
  const doc = construirPdfCotizacion(quote);
  doc.save(`${quote.number || "cotizacion"}.pdf`);
}

export function obtenerPdfBase64(quote) {
  const doc = construirPdfCotizacion(quote);
  const dataUri = doc.output("datauristring");
  return dataUri.split(",")[1] || "";
}