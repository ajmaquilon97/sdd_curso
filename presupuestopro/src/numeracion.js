export function siguienteNumero(contador, fecha) {
  const anio = String(fecha.getFullYear());
  const n = (contador[anio] ?? 0) + 1;
  return {
    numero: `${anio}-${String(n).padStart(3, "0")}`,
    contador: { ...contador, [anio]: n },
  };
}
