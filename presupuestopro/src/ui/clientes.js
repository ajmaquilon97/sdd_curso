import { leer, guardar } from "../storage.js";
import { esc, nuevoId } from "../formato.js";

const ID_DEFECTO = "999999999";

export function montar(cont) {
  let lista = leer("clientes", []);
  let editando = null;

  const dibujar = () => {
    const e = lista.find((c) => c.id === editando);
    const tipo = e?.tipo ?? "ruc";
    cont.innerHTML = `
      <section class="tarjeta">
      <h2>Mis clientes</h2>
      <div class="campo"><label for="nombre">Nombre</label><input id="nombre" value="${esc(e?.nombre)}"></div>
      <div class="campo"><label for="tipo">Tipo de identificación</label>
      <select id="tipo"><option value="ruc" ${tipo === "ruc" ? "selected" : ""}>RUC</option><option value="cedula" ${tipo === "cedula" ? "selected" : ""}>Cédula</option></select></div>
      <div class="campo"><label for="identificacion">Identificación</label><input id="identificacion" placeholder="${ID_DEFECTO}" value="${esc(e?.identificacion)}"></div>
      <div class="acciones"><button class="boton primario" id="guardar">${e ? "Actualizar" : "Agregar"}</button>${e ? '<button class="boton secundario" id="cancelar">Cancelar</button>' : ""}</div>
      <div id="msg" class="mensaje error"></div>
      </section>
      <section class="tarjeta">
      ${lista.length ? `<div class="tabla-contenedor"><table><tr><th>Cliente</th><th>Tipo</th><th>Identificación</th><th class="acciones"></th></tr>
      ${lista.map((c) => `<tr><td>${esc(c.nombre)}</td><td>${c.tipo === "ruc" ? "RUC" : "Cédula"}</td><td>${esc(c.identificacion)}</td>
        <td class="acciones"><button class="boton secundario" data-e="${c.id}">Editar</button><button class="boton peligro" data-d="${c.id}">Eliminar</button></td></tr>`).join("")}</table></div>`
        : '<p class="vacio">Aún no tiene clientes. Agregue el primero con el formulario.</p>'}
      </section>`;
    const $ = (id) => cont.querySelector("#" + id);
    $("guardar").onclick = () => {
      const nombre = $("nombre").value.trim();
      if (!nombre) { $("nombre").classList.add("campo-error"); return ($("msg").textContent = "Ingrese el nombre del cliente"); }
      const datos = { nombre, tipo: $("tipo").value, identificacion: $("identificacion").value.trim() || ID_DEFECTO };
      if (e) Object.assign(e, datos); else lista.push({ id: nuevoId(), ...datos });
      guardar("clientes", lista);
      editando = null;
      dibujar();
    };
    if (e) $("cancelar").onclick = () => { editando = null; dibujar(); };
    cont.querySelectorAll("[data-e]").forEach((b) => (b.onclick = () => { editando = b.dataset.e; dibujar(); }));
    cont.querySelectorAll("[data-d]").forEach((b) => (b.onclick = () => {
      if (!confirm("¿Eliminar este cliente?")) return;
      lista = lista.filter((c) => c.id !== b.dataset.d);
      guardar("clientes", lista);
      editando = null;
      dibujar();
    }));
  };
  dibujar();
}
