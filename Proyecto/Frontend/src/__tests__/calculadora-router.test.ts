import { describe, it, expect } from 'vitest'
import { resolveCalculadoraTarget } from '../components/Calculadora'

describe('Navegación de Calculadora', () => {
  it('resuelve acción línea de crédito', () => {
    expect(resolveCalculadoraTarget('linea')).toBe('linea')
  })

  it("resuelve acción CDT", () => {
    expect(resolveCalculadoraTarget('cdt')).toBe('cdt')
  })

  it('default para acciones desconocidas', () => {
    expect(resolveCalculadoraTarget('otra')).toBe('none')
  })
})