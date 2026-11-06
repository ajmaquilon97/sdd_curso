export function usd(centavos) {
  const signo = centavos < 0 ? "-" : "";
  const abs = Math.abs(centavos);
  const enteros = String(Math.floor(abs / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${signo}$${enteros}.${String(abs % 100).padStart(2, "0")}`;
}

export function nuevoId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function esc(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
