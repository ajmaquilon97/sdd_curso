import { esc, usd } from "../formato.js";
import { listarPresupuestos, obtenerPresupuesto, eliminarPresupuesto } from "../db.js";

const AVISO = '<p class="aviso">Los presupuestos guardados se pierden al cerrar o recargar la página.</p>';
const fechaCorta = (iso) => iso.split("-").reverse().join("/");

export function montar(cont, { db } = {}) {
  if (!db) {
    cont.innerHTML = '<section class="tarjeta"><h2>Guardados</h2><div class="mensaje error">No se pudo iniciar el almacenamiento de presupuestos. Esta sección no está disponible.</div></section>';
    return;
  }
  let filtro = "";

  const eliminar = (id, numero) => {
    if (!window.confirm(`¿Eliminar el presupuesto ${numero}? Esta acción no se puede deshacer.`)) return false;
    eliminarPresupuesto(db, id);
    return true;
  };

  const lista = () => {
    cont.innerHTML = `
      <section class="tarjeta">
      <h2>Presupuestos guardados</h2>
      ${AVISO}
      <div class="campo"><label for="buscar">Buscar por cliente o número</label>
      <input id="buscar" type="search" value="${esc(filtro)}"></div>
      <div id="resultado"></div>
      </section>`;
    const buscar = cont.querySelector("#buscar");
    const resultado = cont.querySelector("#resultado");
    const dibujar = () => {
      const filas = listarPresupuestos(db, filtro);
      if (!filas.length) {
        resultado.innerHTML = `<p class="vacio">${filtro.trim() ? "No hay resultados." : "Aún no hay presupuestos guardados."}</p>`;
        return;
      }
      resultado.innerHTML = `<div class="tabla-contenedor"><table><tr><th>Número</th><th>Cliente</th><th>Fecha</th><th>Total</th><th class="acciones"></th></tr>
        ${filas.map((f) => `<tr><td>${esc(f.numero)}</td><td>${esc(f.clienteNombre)}</td><td>${fechaCorta(f.fecha)}</td><td>${usd(f.total)}</td>
          <td class="acciones"><button class="boton secundario" data-v="${f.id}">Ver detalle</button><button class="boton peligro" data-d="${f.id}" data-n="${esc(f.numero)}">Eliminar</button></td></tr>`).join("")}</table></div>`;
      resultado.querySelectorAll("[data-v]").forEach((b) => (b.onclick = () => detalle(Number(b.dataset.v))));
      resultado.querySelectorAll("[data-d]").forEach((b) => (b.onclick = () => { if (eliminar(Number(b.dataset.d), b.dataset.n)) dibujar(); }));
    };
    buscar.oninput = () => { filtro = buscar.value; dibujar(); };
    dibujar();
  };

  const detalle = (id) => {
    const p = obtenerPresupuesto(db, id);
    if (!p) return lista();
    cont.innerHTML = `
      <section class="tarjeta">
      <h2>Presupuesto ${esc(p.numero)}</h2>
      ${AVISO}
      <p>Fecha: ${fechaCorta(p.fecha)}</p>
      <p>Cliente: ${esc(p.cliente.nombre)} (${p.cliente.tipo === "ruc" ? "RUC" : "Cédula"}: ${esc(p.cliente.identificacion)})</p>
      <div class="tabla-contenedor"><table><tr><th>Servicio</th><th>Precio/hora</th><th>Horas</th><th>Subtotal</th></tr>
      ${p.lineas.map((l) => `<tr><td>${esc(l.nombre)}</td><td>${usd(Math.round(l.precioHora * 100))}</td><td>${l.horas}</td><td>${usd(l.subtotal)}</td></tr>`).join("")}</table></div>
      <div class="totales"><div>Base imponible: ${usd(p.calculo.base)}</div><div>IVA: ${usd(p.calculo.iva)}</div>
      <div>Retención: ${usd(p.calculo.retencion)}</div><div class="total">Total: ${usd(p.calculo.total)}</div></div>
      <div class="acciones"><button class="boton secundario" id="volver">Volver a la lista</button><button class="boton peligro" id="eliminar">Eliminar</button></div>
      </section>`;
    cont.querySelector("#volver").onclick = lista;
    cont.querySelector("#eliminar").onclick = () => { if (eliminar(id, p.numero)) lista(); };
  };

  lista();
}
