import { describe, it, expect } from "vitest";
import { siguienteNumero } from "../../src/numeracion.js";

describe("siguienteNumero", () => {
  it("consecutivo dentro del año", () => {
    const a = siguienteNumero({}, new Date(2026, 5, 1));
    expect(a.numero).toBe("2026-001");
    expect(siguienteNumero(a.contador, new Date(2026, 6, 1)).numero).toBe("2026-002");
  });

  it("reinicia en un año nuevo", () => {
    expect(siguienteNumero({ 2026: 7 }, new Date(2027, 0, 2)).numero).toBe("2027-001");
  });
});
