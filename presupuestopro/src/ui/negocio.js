import { leer, guardar, borrar } from "../storage.js";
import { esc } from "../formato.js";

const MAX_LOGO = 500 * 1024;
const VACIO = { identificacion: "", nombre: "", logo: "", contacto: "", direccion: "", ivaPorTipo: { ruc: 15, cedula: 15 } };

export function montar(cont) {
  const n = { ...VACIO, ...leer("negocio", {}) };
  n.ivaPorTipo = { ...VACIO.ivaPorTipo, ...n.ivaPorTipo };
  let logo = n.logo;

  cont.innerHTML = `
    <section class="tarjeta">
    <h2>Datos de mi negocio</h2>
    <p>${leer("negocio", null) ? "" : "Complete los datos de su negocio"}</p>
    <div class="campo"><label for="identificacion">RUC</label><input id="identificacion" value="${esc(n.identificacion)}"></div>
    <div class="campo"><label for="nombre">Nombre o marca</label><input id="nombre" value="${esc(n.nombre)}"></div>
    <div class="campo"><label for="contacto">Contacto (teléfono o correo)</label><input id="contacto" value="${esc(n.contacto)}"></div>
    <div class="campo"><label for="direccion">Dirección</label><input id="direccion" value="${esc(n.direccion)}"></div>
    <div class="campo"><label for="logo">Logo (máximo 500 KB)</label><input id="logo" type="file" accept="image/png,image/jpeg">
    <img class="logo" id="vista" ${logo ? `src="${logo}"` : "hidden"} alt="Logo"></div>
    <div class="campo"><label for="ivaRuc">IVA para clientes con RUC (%)</label><input id="ivaRuc" type="number" min="0" step="0.01" value="${n.ivaPorTipo.ruc}"></div>
    <div class="campo"><label for="ivaCedula">IVA para clientes con cédula (%)</label><input id="ivaCedula" type="number" min="0" step="0.01" value="${n.ivaPorTipo.cedula}"></div>
    <div class="acciones"><button class="boton primario" id="guardar">Guardar</button><button class="boton peligro" id="eliminar">Eliminar</button></div>
    <div id="msg" class="mensaje"></div>
    </section>`;

  const $ = (id) => cont.querySelector("#" + id);
  const msg = (t, ok) => { $("msg").className = "mensaje " + (ok ? "ok" : "error"); $("msg").textContent = t; };
  const marcar = (...ids) => {
    ["identificacion", "nombre", "contacto", "direccion", "ivaRuc", "ivaCedula", "logo"].forEach((id) =>
      $(id).classList.toggle("campo-error", ids.includes(id)));
  };
  $("vista").onerror = () => { $("vista").hidden = true; };

  $("logo").onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > MAX_LOGO) { e.target.value = ""; marcar("logo"); return msg("El logo no puede superar 500 KB"); }
    const r = new FileReader();
    r.onload = () => { logo = r.result; $("vista").src = logo; $("vista").hidden = false; marcar(); msg(""); };
    r.readAsDataURL(f);
  };

  $("guardar").onclick = () => {
    const datos = {
      identificacion: $("identificacion").value.trim(),
      nombre: $("nombre").value.trim(),
      contacto: $("contacto").value.trim(),
      direccion: $("direccion").value.trim(),
      logo,
      ivaPorTipo: { ruc: Number($("ivaRuc").value), cedula: Number($("ivaCedula").value) },
    };
    const faltan = ["identificacion", "nombre", "contacto", "direccion"].filter((k) => !datos[k]);
    if (faltan.length) { marcar(...faltan); return msg("Complete RUC, nombre, contacto y dirección"); }
    const ivaMal = [];
    if (!(datos.ivaPorTipo.ruc >= 0)) ivaMal.push("ivaRuc");
    if (!(datos.ivaPorTipo.cedula >= 0)) ivaMal.push("ivaCedula");
    if (ivaMal.length) { marcar(...ivaMal); return msg("El IVA debe ser 0 o mayor"); }
    marcar();
    guardar("negocio", datos);
    msg("Datos guardados", true);
  };

  $("eliminar").onclick = () => {
    if (!confirm("¿Eliminar los datos de su negocio?")) return;
    borrar("negocio");
    montar(cont);
  };
}
