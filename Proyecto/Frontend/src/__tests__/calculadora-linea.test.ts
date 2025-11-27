import { describe, it, expect } from 'vitest'
import { calcularCuotaCredito, generarAmortizacionCredito } from '../components/CalculadoraLineaCredito'

describe('Calculadora de Línea de Crédito', () => {
  it('calcula la cuota mensual incluyendo amortización francesa', () => {
    const cuota = calcularCuotaCredito(10_000_000, 24, 36, 0)
    expect(cuota).toBeGreaterThan(350_000)
    expect(cuota).toBeLessThan(410_000)
  })

  it('genera tabla de amortización con saldo final cercano a 0', () => {
    const cuota = calcularCuotaCredito(10_000_000, 24, 36, 0)
    const schedule = generarAmortizacionCredito(10_000_000, 24, 36, cuota, 0)
    const last = schedule[schedule.length - 1]
    expect(schedule.length).toBe(36)
    expect(last.saldoFinal).toBeLessThan(100)
  })

  it('mantiene coherencia entre total pagado e intereses + capital', () => {
    const cuota = calcularCuotaCredito(5_000_000, 18, 24, 0)
    const schedule = generarAmortizacionCredito(5_000_000, 18, 24, cuota, 0)
    const totalPagado = cuota * 24
    const totalInteres = schedule.reduce((s, r) => s + r.interes, 0)
    const capitalPagado = 5_000_000 - schedule[schedule.length - 1].saldoFinal
    expect(Math.abs(totalPagado - (totalInteres + capitalPagado))).toBeLessThan(200)
  })
})