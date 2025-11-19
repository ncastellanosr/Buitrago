import { insertarCuenta, user } from "./index";
import { AccountTypeOptions } from "../entities/Account";

describe("Cuenta", () => {
  beforeEach(() => {
    // limpiar estado compartido entre tests
    user.account = [];
  });

  test("Insertar cuenta en usuario", () => {
    //caso 1: inserción exitosa
    expect(insertarCuenta(user, {
      id: 1,
      user: 1,
      accountName: "Ahorros",
      accountType: AccountTypeOptions.SAVINGS,
      currency: "USD",
      createdAt: new Date(),
      isActive: true,
      cachedBalance: 1000.0,
    })).toBe("Cuenta agregada exitosamente.");
    //caso 2: fallo por id de usuario no coincide
    expect(insertarCuenta(user, {
        id: 2,
        user: 2,
        accountName: "Corriente",
        accountType: AccountTypeOptions.CHECKING,
        currency: "USD",
        createdAt: new Date(),
        isActive: true,
        cachedBalance: 500.0,
      })).toBe('El ID del usuario no coincide con el propietario de la cuenta. Inserción abortada.');
  });

  test("Validaciones de inserción de cuenta", () => {
    //caso 1: fallo por nombre de cuenta vacío
    expect(insertarCuenta(user, {
        id: 3,
        user: 1,
        accountName: "",
        accountType: AccountTypeOptions.CASH,
        currency: "USD",
        createdAt: new Date(),
        isActive: true,
        cachedBalance: 300.0,
      })).toBe('El nombre de la cuenta es obligatorio. Inserción abortada.');
    //caso 2: fallo por moneda vacía
    expect(insertarCuenta(user, {
        id: 4,
        user: 1,
        accountName: "Inversiones",
        accountType: AccountTypeOptions.INVESTMENT,
        currency: "",
        createdAt: new Date(),
        isActive: true,
        cachedBalance: 2000.0,
      })).toBe('La moneda de la cuenta es obligatoria. Inserción abortada.');
    //caso 3: fallo por balance inicial nulo
        expect(insertarCuenta(user, {
            id: 5,
            user: 1,
            accountName: "Tarjeta de Crédito",
            accountType: AccountTypeOptions.CREDIT_CARD,
            currency: "USD",
            createdAt: new Date(),
            isActive: true,
            cachedBalance: null as any,
          })).toBe('El balance inicial de la cuenta es obligatorio. Inserción abortada.');
  });
  test("Desactivar cuenta", () => {
    const newAccount = {
        id: 6,
        user: 1,
        accountName: "Cuenta a Desactivar",
        accountType: AccountTypeOptions.OTHER,
        currency: "USD",
        createdAt: new Date(),
        isActive: true,
        cachedBalance: 150.0,
      };
    expect(insertarCuenta(user, newAccount)).toBe("Cuenta agregada exitosamente.");
    // ahora desactivar la cuenta
    const { desactivarCuenta } = require("./index");
    expect(desactivarCuenta(user, newAccount)).toBe("Cuenta desactivada exitosamente.");
    expect(newAccount.isActive).toBe(false);
  });
});

