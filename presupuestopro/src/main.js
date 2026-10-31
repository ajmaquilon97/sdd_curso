import * as negocio from "./ui/negocio.js";
import * as servicios from "./ui/servicios.js";
import * as clientes from "./ui/clientes.js";
import * as presupuesto from "./ui/presupuesto.js";

const pantallas = { negocio, servicios, clientes, presupuesto };
const app = document.getElementById("app");
const nav = document.getElementById("nav");

function mostrar(nombre) {
  nav.querySelectorAll("button").forEach((b) => {
    if (b.dataset.p === nombre) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  });
  pantallas[nombre].montar(app);
}

nav.addEventListener("click", (e) => {
  if (e.target.dataset.p) mostrar(e.target.dataset.p);
});

mostrar("negocio");
