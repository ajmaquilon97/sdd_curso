export function leer(clave, porDefecto) {
  try {
    const v = localStorage.getItem(clave);
    return v === null ? porDefecto : JSON.parse(v);
  } catch {
    return porDefecto;
  }
}

export function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

export function borrar(clave) {
  localStorage.removeItem(clave);
}
