import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  OneToMany
} from "typeorm";
import { AuthUser } from "./AuthUser";
import { TransactionTbl } from "./TransactionTbl";
import { Reminder } from "./Reminder";

// Tipos de cuenta
export enum AccountTypeOptions {
    CASH = 'CASH',
    SAVINGS = 'SAVINGS',
    CHECKING = 'CHECKING',
    CREDIT_CART = 'CREDIT_CART',
    INVESTMENT = 'INVESTMENT',
    OTHER = 'OTHER'
}
export enum AccountCurrencyOptions {
    USD = 'USD',
    COP = 'COP',
    EUR = 'EUR'
}
//Este triple h... jsjsjsjsjsjs pdta: eliminar comentarios xd antes de la entrega final 
@Index( ["user", "accountType"])
@Entity('account')
export class Account {
    @PrimaryGeneratedColumn('increment', { type: 'bigint'})
    id: number;

    @ManyToOne(() => AuthUser, (user) => user.account, {onDelete: 'CASCADE'})
    user: AuthUser

    @Column({name: 'account_name', type: 'varchar', length: 150})
    accountName: string;

    @Column({ name: 'account_token', type: 'varchar', length: 255})
    accountNumber: string;

    @Column({ 
        name: 'type', 
        type: 'enum', 
        enum: AccountTypeOptions, 
        default: AccountTypeOptions.OTHER})
    accountType: AccountTypeOptions;

    @Column({ 
        name: 'currency', 
        type: 'enum', 
        enum: AccountCurrencyOptions, 
        default: AccountCurrencyOptions.COP})
    accountCurrency: AccountCurrencyOptions;

    @CreateDateColumn({name: 'created_at',  type: 'datetime'})
    createdAt: Date;

    @Column({ name: 'is_active', type: 'boolean'})
    isActive: boolean;

    @Column({ name: 'cached_balance', type: 'decimal', precision: 20, scale: 4, default: 0.0000 })
    cachedBalance: number;

    @OneToMany(() => TransactionTbl, (transactionTbl) => transactionTbl.account )
    transaction: TransactionTbl[]

    // inversa para las transacciones donde esta cuenta es 'relatedAccount'
    @OneToMany(() => TransactionTbl, (transactionTbl) => transactionTbl.relatedAccount)
    relatedTransactions: TransactionTbl[]

    @OneToMany(() => Reminder, (reminder) => reminder.account)
    reminder: Reminder[]
}