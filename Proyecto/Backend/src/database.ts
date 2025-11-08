import "reflect-metadata";
import { DataSource } from "typeorm";
import { AuthUser, UserRole } from "./entities/AuthUser";

export class Database {
  private static _instance: DataSource | null = null;

  private constructor() {} // Bloquear creación directa de instancias

  public static getInstance(): DataSource {
    if (!Database._instance) {
      // Si no existen instancias en memoria crear
      Database._instance = new DataSource(
        {
          type: "mysql",
          host: "localhost",
          port: 3306,
          username: "root",
          password: "123456",
          database: "ubudget_database",
          dropSchema: true,
          synchronize: true, // Quitar cuando terminemos el desarrollo
          logging: true,
          entities: [AuthUser]
        }
      );
    }

    return Database._instance;
  }
}

export const AppDataSource = Database.getInstance();
