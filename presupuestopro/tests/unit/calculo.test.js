import { describe, it, expect } from "vitest";
import { calcular } from "../../src/calculo.js";

const iva = { ruc: 15, cedula: 15 };
const tresLineas = [
  { precioHora: 20, horas: 8 },
  { precioHora: 40, horas: 4 },
  { precioHora: 80, horas: 2 },
];

describe("calcular", () => {
  it("ejemplo de 3 líneas de $160 con RUC", () => {
    const r = calcular({ lineas: tresLineas, tipoCliente: "ruc", ivaPorTipo: iva });
    expect(r.subtotales).toEqual([16000, 16000, 16000]);
    expect(r).toMatchObject({ base: 48000, iva: 7200, retencion: 3360, total: 58560 });
  });

  it("cédula no tiene retención", () => {
    const r = calcular({ lineas: tresLineas, tipoCliente: "cedula", ivaPorTipo: iva });
    expect(r.retencion).toBe(0);
    expect(r.total).toBe(55200);
  });

  it("redondea siempre hacia arriba al centavo", () => {
    const r = calcular({ lineas: [{ precioHora: 10.01, horas: 1.25 }], tipoCliente: "cedula", ivaPorTipo: iva });
    expect(r.subtotales[0]).toBe(1252);
    expect(r.iva).toBe(188);
  });

  it("no suma un centavo de más por coma flotante", () => {
    const r = calcular({ lineas: [{ precioHora: 30, horas: 1.1 }], tipoCliente: "cedula", ivaPorTipo: iva });
    expect(r.subtotales[0]).toBe(3300);
  });

  it("usa el IVA configurado por tipo", () => {
    const r = calcular({ lineas: tresLineas, tipoCliente: "ruc", ivaPorTipo: { ruc: 10, cedula: 15 } });
    expect(r.iva).toBe(4800);
  });
});
