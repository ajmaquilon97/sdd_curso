import { describe, it, expect, beforeEach } from "vitest";
import initSqlJs from "sql.js";
import { crearBase, guardarPresupuesto, listarPresupuestos, obtenerPresupuesto, eliminarPresupuesto } from "../../src/db.js";

const SQL = await initSqlJs();

const presupuesto = (numero, nombre = "Álvarez Cía", extra = {}) => ({
  numero,
  fecha: "2026-11-02",
  cliente: { nombre, tipo: "ruc", identificacion: "1790012345001" },
  lineas: [
    { nombre: "Diseño", precioHora: 25.5, horas: 2, subtotal: 5100 },
    { nombre: "Soporte", precioHora: 10, horas: 1.5, subtotal: 1500 },
  ],
  calculo: { base: 6600, iva: 990, retencion: 462, total: 8052 },
  ...extra,
});

let db;
beforeEach(() => { db = crearBase(SQL); });

describe("guardar y obtener", () => {
  it("guarda y conserva los valores", () => {
    const r = guardarPresupuesto(db, presupuesto("2026-001"));
    expect(r.ok).toBe(true);
    const g = obtenerPresupuesto(db, r.id);
    expect(g.numero).toBe("2026-001");
    expect(g.cliente.nombre).toBe("Álvarez Cía");
    expect(g.lineas.map((l) => l.nombre)).toEqual(["Diseño", "Soporte"]);
    expect(g.lineas[0].precioHora).toBe(25.5);
    expect(g.calculo.total).toBe(8052);
    expect(g.calculo.subtotales).toEqual([5100, 1500]);
  });

  it("rechaza sin cliente, sin líneas y duplicados", () => {
    expect(guardarPresupuesto(db, presupuesto("2026-001", "", {}))).toEqual({ ok: false, motivo: "sin-cliente" });
    expect(guardarPresupuesto(db, presupuesto("2026-001", "X", { lineas: [] }))).toEqual({ ok: false, motivo: "sin-lineas" });
    expect(guardarPresupuesto(db, presupuesto("2026-001")).ok).toBe(true);
    expect(guardarPresupuesto(db, presupuesto("2026-001"))).toEqual({ ok: false, motivo: "duplicado" });
    expect(listarPresupuestos(db)).toHaveLength(1);
  });

  it("es todo o nada si falla una línea", () => {
    const p = presupuesto("2026-002");
    p.lineas[1].nombre = null;
    expect(guardarPresupuesto(db, p)).toEqual({ ok: false, motivo: "error" });
    expect(listarPresupuestos(db)).toHaveLength(0);
    expect(guardarPresupuesto(db, presupuesto("2026-002")).ok).toBe(true);
  });

  it("devuelve null si no existe", () => {
    expect(obtenerPresupuesto(db, 999)).toBeNull();
  });
});

describe("listar y filtrar", () => {
  beforeEach(() => {
    guardarPresupuesto(db, presupuesto("2026-001", "Álvarez Cía"));
    guardarPresupuesto(db, presupuesto("2026-002", "Beatriz Mora"));
    guardarPresupuesto(db, presupuesto("2026-003", "Carlos Pérez"));
  });

  it("ordena del más reciente al más antiguo", () => {
    expect(listarPresupuestos(db).map((x) => x.numero)).toEqual(["2026-003", "2026-002", "2026-001"]);
  });

  it("filtra por cliente sin distinguir mayúsculas ni tildes", () => {
    expect(listarPresupuestos(db, "ÁLVAREZ").map((x) => x.numero)).toEqual(["2026-001"]);
    expect(listarPresupuestos(db, "alvarez").map((x) => x.numero)).toEqual(["2026-001"]);
    expect(listarPresupuestos(db, "perez")).toHaveLength(1);
  });

  it("filtra por número, y vacío o espacios devuelven todo", () => {
    expect(listarPresupuestos(db, "2026-002").map((x) => x.numero)).toEqual(["2026-002"]);
    expect(listarPresupuestos(db, "   ")).toHaveLength(3);
    expect(listarPresupuestos(db, "zzz")).toHaveLength(0);
    expect(listarPresupuestos(db, "%")).toHaveLength(0);
  });
});

describe("eliminar", () => {
  it("borra el presupuesto y sus líneas", () => {
    const { id } = guardarPresupuesto(db, presupuesto("2026-001"));
    expect(eliminarPresupuesto(db, id)).toBe(true);
    expect(obtenerPresupuesto(db, id)).toBeNull();
    expect(db.exec("SELECT COUNT(*) FROM lineas")[0].values[0][0]).toBe(0);
    expect(eliminarPresupuesto(db, id)).toBe(false);
  });
});
