import { leer, guardar } from "../storage.js";
import { esc, nuevoId, usd } from "../formato.js";

export function montar(cont) {
  let lista = leer("servicios", []);
  let editando = null;

  const dibujar = () => {
    const e = lista.find((s) => s.id === editando);
    cont.innerHTML = `
      <section class="tarjeta">
      <h2>Mis servicios</h2>
      <div class="campo"><label for="nombre">Nombre</label><input id="nombre" value="${esc(e?.nombre)}"></div>
      <div class="campo"><label for="precio">Precio por hora (USD)</label><input id="precio" type="number" min="0" step="0.01" value="${e ? e.precioHora : ""}"></div>
      <div class="acciones"><button class="boton primario" id="guardar">${e ? "Actualizar" : "Agregar"}</button>${e ? '<button class="boton secundario" id="cancelar">Cancelar</button>' : ""}</div>
      <div id="msg" class="mensaje error"></div>
      </section>
      <section class="tarjeta">
      ${lista.length ? `<div class="tabla-contenedor"><table><tr><th>Servicio</th><th>Precio/hora</th><th class="acciones"></th></tr>
      ${lista.map((s) => `<tr><td>${esc(s.nombre)}</td><td>${usd(Math.round(s.precioHora * 100))}</td>
        <td class="acciones"><button class="boton secundario" data-e="${s.id}">Editar</button><button class="boton peligro" data-d="${s.id}">Eliminar</button></td></tr>`).join("")}</table></div>`
        : '<p class="vacio">Aún no tiene servicios. Agregue el primero con el formulario.</p>'}
      </section>`;
    const $ = (id) => cont.querySelector("#" + id);
    const error = (t, ...ids) => { ids.forEach((i) => $(i).classList.add("campo-error")); $("msg").textContent = t; };
    $("guardar").onclick = () => {
      const nombre = $("nombre").value.trim();
      const precio = Number($("precio").value);
      if (!nombre) return error("Ingrese el nombre del servicio", "nombre");
      if (!(precio > 0)) return error("El precio por hora debe ser mayor a 0", "precio");
      if (e) { e.nombre = nombre; e.precioHora = precio; } else lista.push({ id: nuevoId(), nombre, precioHora: precio });
      guardar("servicios", lista);
      editando = null;
      dibujar();
    };
    if (e) $("cancelar").onclick = () => { editando = null; dibujar(); };
    cont.querySelectorAll("[data-e]").forEach((b) => (b.onclick = () => { editando = b.dataset.e; dibujar(); }));
    cont.querySelectorAll("[data-d]").forEach((b) => (b.onclick = () => {
      if (!confirm("¿Eliminar este servicio?")) return;
      lista = lista.filter((s) => s.id !== b.dataset.d);
      guardar("servicios", lista);
      editando = null;
      dibujar();
    }));
  };
  dibujar();
}
