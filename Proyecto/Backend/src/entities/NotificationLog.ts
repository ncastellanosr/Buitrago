import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
} from "typeorm";
import { AuthUser } from "./AuthUser";
import { Reminder } from "./Reminder";
import { Obligation } from "./Obligation";
import { TransactionTbl } from "./TransactionTbl";

export enum Channel{
    EMAIL='email',
    SMS='sms',
    PUSH='push',
    IN_APP='in_app',
    SYSTEM='system'
}

export enum Status{
    PENDING='pending',
    SENT='sent',
    FAILED='failed',
}

@Index(["user", "attemptedAt"])
@Entity('notification_log')
export class NotificationLog{

    @PrimaryGeneratedColumn('increment', {type: 'bigint'})
    id: number;

    @ManyToOne(() => AuthUser, (user) => user.notifications, {onDelete: 'CASCADE', nullable:false})
    user: AuthUser

    @ManyToOne(() => Reminder, (reminder) => reminder.notifications, {onDelete: 'SET NULL'})
    reminder: Reminder

    @ManyToOne(() => Obligation, (obligation) => obligation.notifications, {onDelete: 'SET NULL'} )
    obligation: Obligation

    @ManyToOne(() => TransactionTbl, (transaction) => transaction.notifications, {onDelete: 'SET NULL'})
    transaction: TransactionTbl

    @Column({
        type: 'enum',
        enum: Channel
    })
    channel: Channel;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.PENDING
    })
    status: Status;

    @Column({ type: 'json', nullable: true})
    payload: object | null;

    @CreateDateColumn({name: 'attempted_at', type: 'datetime'})
    attemptedAt: Date;

}