export const normalizar = (t) =>
  String(t ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const ESQUEMA = `
  CREATE TABLE presupuestos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero TEXT UNIQUE NOT NULL,
    fecha TEXT NOT NULL,
    creado_en INTEGER NOT NULL,
    cliente_nombre TEXT NOT NULL,
    cliente_tipo TEXT NOT NULL,
    cliente_identificacion TEXT NOT NULL,
    cliente_busqueda TEXT NOT NULL,
    base INTEGER NOT NULL,
    iva INTEGER NOT NULL,
    retencion INTEGER NOT NULL,
    total INTEGER NOT NULL
  );
  CREATE TABLE lineas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    presupuesto_id INTEGER NOT NULL REFERENCES presupuestos(id) ON DELETE CASCADE,
    posicion INTEGER NOT NULL,
    servicio TEXT NOT NULL,
    precio_hora INTEGER NOT NULL,
    horas REAL NOT NULL,
    subtotal INTEGER NOT NULL
  );`;

function filas(db, sql, params = []) {
  const st = db.prepare(sql);
  try {
    st.bind(params);
    const out = [];
    while (st.step()) out.push(st.getAsObject());
    return out;
  } finally {
    st.free();
  }
}

export function crearBase(SQL) {
  const db = new SQL.Database();
  db.run("PRAGMA foreign_keys = ON;");
  db.run(ESQUEMA);
  return db;
}

export function guardarPresupuesto(db, p) {
  const c = p.cliente;
  if (!c?.nombre || !c.identificacion) return { ok: false, motivo: "sin-cliente" };
  if (!p.lineas?.length) return { ok: false, motivo: "sin-lineas" };
  if (filas(db, "SELECT 1 FROM presupuestos WHERE numero = ?", [p.numero]).length) {
    return { ok: false, motivo: "duplicado" };
  }
  try {
    db.run("BEGIN");
    db.run(
      `INSERT INTO presupuestos (numero, fecha, creado_en, cliente_nombre, cliente_tipo, cliente_identificacion,
        cliente_busqueda, base, iva, retencion, total) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [p.numero, p.fecha, Date.now(), c.nombre, c.tipo, c.identificacion, normalizar(c.nombre),
        p.calculo.base, p.calculo.iva, p.calculo.retencion, p.calculo.total],
    );
    const id = filas(db, "SELECT last_insert_rowid() AS id")[0].id;
    p.lineas.forEach((l, i) => {
      db.run(
        "INSERT INTO lineas (presupuesto_id, posicion, servicio, precio_hora, horas, subtotal) VALUES (?,?,?,?,?,?)",
        [id, i, l.nombre, Math.round(l.precioHora * 100), l.horas, l.subtotal],
      );
    });
    db.run("COMMIT");
    return { ok: true, id };
  } catch {
    try { db.run("ROLLBACK"); } catch { /* sin transacción activa */ }
    return { ok: false, motivo: "error" };
  }
}

export function listarPresupuestos(db, filtro = "") {
  const f = normalizar(filtro).replace(/[\\%_]/g, "\\$&");
  const patron = `%${f}%`;
  return filas(
    db,
    `SELECT id, numero, fecha, cliente_nombre AS clienteNombre, total FROM presupuestos
     WHERE cliente_busqueda LIKE ? ESCAPE '\\' OR LOWER(numero) LIKE ? ESCAPE '\\'
     ORDER BY creado_en DESC, id DESC`,
    [patron, patron],
  );
}

export function obtenerPresupuesto(db, id) {
  const r = filas(db, "SELECT * FROM presupuestos WHERE id = ?", [id])[0];
  if (!r) return null;
  const lineas = filas(db, "SELECT servicio, precio_hora, horas, subtotal FROM lineas WHERE presupuesto_id = ? ORDER BY posicion", [id])
    .map((l) => ({ nombre: l.servicio, precioHora: l.precio_hora / 100, horas: l.horas, subtotal: l.subtotal }));
  return {
    id: r.id,
    numero: r.numero,
    fecha: r.fecha,
    cliente: { nombre: r.cliente_nombre, tipo: r.cliente_tipo, identificacion: r.cliente_identificacion },
    lineas,
    calculo: { base: r.base, iva: r.iva, retencion: r.retencion, total: r.total, subtotales: lineas.map((l) => l.subtotal) },
  };
}

export function eliminarPresupuesto(db, id) {
  db.run("DELETE FROM presupuestos WHERE id = ?", [id]);
  return db.getRowsModified() > 0;
}
