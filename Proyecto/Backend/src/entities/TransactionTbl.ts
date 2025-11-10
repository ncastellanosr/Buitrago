import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { Account } from "./Account";
import { Category } from "./Category";
import { NotificationLog } from "./NotificationLog";

export enum TransactionType {
    INCONME='income',
    EXPENSE='expense',
    TRANSFER='transfer'
}

@Index(["account", "ocurredAt"])
@Index(["transactionType", "ocurredAt"])
@Entity('transaction_tbl')
export class TransactionTbl {
    @PrimaryGeneratedColumn('increment', {name: 'transaction_id',type: 'bigint'})
    id: number;

    @ManyToOne(() => Account, (account) => account.transaction, {onDelete: 'CASCADE', nullable:false})
    account: Account

    @OneToOne(() => TransactionTbl,{onDelete: 'SET NULL'})
    @JoinColumn()
    relatedAccount: TransactionTbl

    @Index()
    @ManyToOne(() => Category, (category) => category.transaction, {onDelete: 'SET NULL'})
    category: Category

    @Column({
        name: 'type',
        type: 'enum',
        enum: TransactionType
    })
    transactionType: TransactionType;

    @Column({type: 'decimal', precision: 20, scale:4})
    amount: number;

    @Column({ type: 'char', length: 3, default: 'USD'})
    currency: string;

    @Column({ type: 'text', nullable: true})
    description: string;

    @Column({name: 'ocurred_at', type: 'datetime'})
    ocurredAt: Date;

    @CreateDateColumn({ name: 'created_at', type: 'datetime'})
    createdAt: Date;

    @Column({name: 'is_recociled', type: 'boolean', default: false})
    isReconciled: boolean;

    @Column({ type: 'json', nullable: true})
    metadata: object | null;

    @OneToMany(() => NotificationLog, (notifications) => notifications.transaction)
    notifications: NotificationLog[]

}