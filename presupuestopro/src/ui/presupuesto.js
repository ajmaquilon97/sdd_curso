import { leer, guardar } from "../storage.js";
import { esc, usd } from "../formato.js";
import { calcular } from "../calculo.js";
import { siguienteNumero } from "../numeracion.js";
import { generarPdf } from "../pdf.js";

const IVA_DEFECTO = { ruc: 15, cedula: 15 };
const horasValidas = (h) => h > 0 && Math.abs(h * 100 - Math.round(h * 100)) < 1e-9;

export function montar(cont) {
  const servicios = leer("servicios", []);
  const clientes = leer("clientes", []);
  const negocio = leer("negocio", null);
  const ivaPorTipo = negocio?.ivaPorTipo ?? IVA_DEFECTO;
  let clienteId = clientes[0]?.id ?? "";
  let lineas = [];

  cont.innerHTML = `
    <section class="tarjeta">
    <h2>Nuevo presupuesto</h2>
    <div class="campo"><label for="cliente">Cliente</label>
    <select id="cliente">${clientes.length ? clientes.map((c) => `<option value="${c.id}">${esc(c.nombre)} (${c.tipo === "ruc" ? "RUC" : "Cédula"})</option>`).join("") : '<option value="">Primero agregue un cliente</option>'}</select></div>
    <div class="campo"><label for="servicio">Agregar servicio</label>
    <select id="servicio">${servicios.length ? servicios.map((s) => `<option value="${s.id}">${esc(s.nombre)} - ${usd(Math.round(s.precioHora * 100))}/hora</option>`).join("") : '<option value="">Primero agregue un servicio</option>'}</select></div>
    <div class="acciones"><button class="boton secundario" id="agregar">Agregar al presupuesto</button></div>
    </section>
    <section class="tarjeta">
    <div class="tabla-contenedor"><table id="tabla"></table></div>
    <p class="vacio" id="vacio">Agregue servicios para calcular el presupuesto.</p>
    <div class="totales" id="totales"></div>
    <div class="acciones"><button class="boton primario" id="pdf" disabled>Descargar PDF</button></div>
    <div id="msg" class="mensaje error"></div>
    </section>`;

  const $ = (id) => cont.querySelector("#" + id);
  const msg = (t) => { $("msg").textContent = t; };
  const cliente = () => clientes.find((c) => c.id === clienteId);

  const totales = () => {
    const c = cliente();
    const validas = lineas.map((l) => ({ ...l, horas: horasValidas(l.horas) ? l.horas : 0 }));
    const r = calcular({ lineas: validas, tipoCliente: c?.tipo ?? "ruc", ivaPorTipo });
    $("totales").innerHTML = `<div>Base imponible: ${usd(r.base)}</div><div>IVA: ${usd(r.iva)}</div>
      <div>Retención: ${usd(r.retencion)}</div><div class="total">Total: ${usd(r.total)}</div>`;
    lineas.forEach((_, i) => { const td = cont.querySelector(`#sub${i}`); if (td) td.textContent = usd(r.subtotales[i]); });
    return r;
  };

  const tabla = () => {
    $("vacio").hidden = lineas.length > 0;
    $("tabla").hidden = lineas.length === 0;
    $("pdf").disabled = lineas.length === 0;
    $("tabla").innerHTML = `<tr><th>Servicio</th><th>Precio/hora</th><th>Horas</th><th>Subtotal</th><th class="acciones"></th></tr>` +
      lineas.map((l, i) => `<tr class="linea"><td>${esc(l.nombre)}</td><td>${usd(Math.round(l.precioHora * 100))}</td>
        <td><input data-h="${i}" type="number" min="0" step="0.01" value="${l.horas}" aria-label="Horas de ${esc(l.nombre)}"></td>
        <td id="sub${i}"></td><td class="acciones"><button class="boton peligro" data-q="${i}">Quitar</button></td></tr>`).join("");
    $("tabla").querySelectorAll("[data-h]").forEach((inp) => (inp.oninput = () => {
      lineas[inp.dataset.h].horas = Number(inp.value);
      inp.classList.remove("campo-error");
      msg("");
      totales();
    }));
    $("tabla").querySelectorAll("[data-q]").forEach((b) => (b.onclick = () => { lineas.splice(b.dataset.q, 1); tabla(); }));
    totales();
  };

  $("cliente").onchange = (e) => { clienteId = e.target.value; totales(); };
  $("agregar").onclick = () => {
    const s = servicios.find((x) => x.id === $("servicio").value);
    if (!s) return msg("Primero agregue un servicio");
    lineas.push({ nombre: s.nombre, precioHora: s.precioHora, horas: 1 });
    msg("");
    tabla();
  };

  $("pdf").onclick = () => {
    if (!negocio) return msg("Complete los datos de su negocio antes de descargar");
    if (!cliente()) return msg("Seleccione un cliente");
    if (!lineas.length) return msg("Agregue al menos un servicio");
    if (lineas.some((l) => !horasValidas(l.horas))) {
      $("tabla").querySelectorAll("[data-h]").forEach((inp) => inp.classList.toggle("campo-error", !horasValidas(lineas[inp.dataset.h].horas)));
      return msg("Las horas deben ser mayores a 0 (máximo 2 decimales)");
    }
    const fecha = new Date();
    const { numero, contador } = siguienteNumero(leer("contador", {}), fecha);
    const c = cliente();
    generarPdf({ negocio, cliente: { nombre: c.nombre, tipo: c.tipo, identificacion: c.identificacion }, lineas, calculo: totales(), numero, fecha });
    guardar("contador", contador);
    msg("");
  };

  tabla();
}
