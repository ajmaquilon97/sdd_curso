const techoDiv = (a, b) => Math.floor((a + b - 1) / b);

export const RETENCION_RUC_BP = 700;

export function calcular({ lineas, tipoCliente, ivaPorTipo }) {
  const subtotales = lineas.map((l) =>
    techoDiv(Math.round(l.precioHora * 100) * Math.round(l.horas * 100), 100)
  );
  const base = subtotales.reduce((s, x) => s + x, 0);
  const ivaBp = Math.round((ivaPorTipo[tipoCliente] ?? 0) * 100);
  const iva = techoDiv(base * ivaBp, 10000);
  const retencion = tipoCliente === "ruc" ? techoDiv(base * RETENCION_RUC_BP, 10000) : 0;
  return { subtotales, base, iva, retencion, total: base + iva + retencion };
}
