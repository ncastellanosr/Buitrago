import { describe, it, expect } from 'vitest'
import { calcularCDTNeto, tasaMensualDesdeEA } from '../components/CalculadoraCDT'

describe("Calculadora de CDT", () => {
  it('calcula neto al vencimiento con capitalización y retención', () => {
    const res = calcularCDTNeto('vencimiento', 5_000_000, 12, 12, 4)
    expect(res.interes).toBeGreaterThan(550_000)
    expect(res.interes).toBeLessThan(610_000)
    expect(res.neto).toBeGreaterThan(5_560_000)
    expect(res.neto).toBeLessThan(5_590_000)
  })

  it('en pago periódico el neto es menor que al vencimiento (sin capitalizar)', () => {
    const vto = calcularCDTNeto('vencimiento', 5_000_000, 12, 12, 4)
    const per = calcularCDTNeto('periodico', 5_000_000, 12, 12, 4)
    expect(per.neto).toBeLessThan(vto.neto)
  })

  it('la retención corresponde al porcentaje sobre el interés', () => {
    const tm = tasaMensualDesdeEA(10)
    const res = calcularCDTNeto('periodico', 4_000_000, 10, 6, 4)
    const interesEsperado = 4_000_000 * tm * 6
    expect(Math.abs(res.interes - interesEsperado)).toBeLessThan(1)
    expect(Math.abs(res.retencion - interesEsperado * 0.04)).toBeLessThan(1)
  })
})