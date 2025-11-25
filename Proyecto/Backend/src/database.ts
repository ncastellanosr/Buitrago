import "reflect-metadata";
import { DataSource } from "typeorm";
import { AuthUser, UserRole } from "./entities/AuthUser";
import dotenv from "dotenv";
import { Account } from "./entities/Account";
import { BalanceHistory } from "./entities/BalanceHistory";
import { Budget } from "./entities/Budget";
import { Category } from "./entities/Category";
import { Noticia } from "./entities/Noticia";
import { NotificationLog } from "./entities/NotificationLog";
import { Obligation } from "./entities/Obligation";
import { PreferenciaNoticia } from "./entities/PreferenciaNoticia";
import { Reminder } from "./entities/Reminder";
import { SimulacionFinanciera } from "./entities/SimulacionFinanciera";
import { TransactionTbl } from "./entities/TransactionTbl";
dotenv.config({ override:true});

export class Database {
  private static _instance: DataSource | null = null;
  private constructor() {} // Bloquear creación directa de instancias

  public static getInstance(): DataSource {
    if (!Database._instance) {
      // Si no existen instancias en memoria crear
      Database._instance = new DataSource(
        {
          type: "mysql",
          host: process.env.HOST,
          port: Number(process.env.PORT),
          username: process.env.USERNAME,
          password: process.env.PASSWORD,
          database: process.env.DATABASE,
          dropSchema: true,
          synchronize: true, // Quitar cuando terminemos el desarrollo
          logging: true,
          charset: 'utf8mb4_unicode_ci',
          // collation: 'utf8mb4_0900_ai_ci', 
          entities: [
            AuthUser,
            Account,
            BalanceHistory, 
            Budget, 
            Category, 
            Noticia, 
            NotificationLog, 
            Obligation, 
            PreferenciaNoticia, 
            Reminder, 
            SimulacionFinanciera, 
            TransactionTbl]
        }
      );
    }

    return Database._instance;
  }
}

export const AppDataSource = Database.getInstance();
