import * as negocio from "./ui/negocio.js";
import * as servicios from "./ui/servicios.js";
import * as clientes from "./ui/clientes.js";
import * as presupuesto from "./ui/presupuesto.js";
import * as guardados from "./ui/guardados.js";
import { crearBase } from "./db.js";

const pantallas = { negocio, servicios, clientes, presupuesto, guardados };
const app = document.getElementById("app");
const nav = document.getElementById("nav");

let db = null;
try {
  const SQL = await window.initSqlJs({ locateFile: () => "src/vendor/sql-wasm.wasm" });
  db = crearBase(SQL);
} catch {
  db = null;
}
if (!db) nav.querySelector('[data-p="guardados"]').disabled = true;

function mostrar(nombre) {
  nav.querySelectorAll("button").forEach((b) => {
    if (b.dataset.p === nombre) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  });
  pantallas[nombre].montar(app, { db });
}

nav.addEventListener("click", (e) => {
  if (e.target.dataset.p) mostrar(e.target.dataset.p);
});

mostrar("negocio");
