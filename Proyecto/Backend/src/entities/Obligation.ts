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
import { Reminder } from "./Reminder";
import { NotificationLog } from "./NotificationLog";

export enum Frequency{
    ONE_TIME='one_time',
    MONTHLY='monthly',
    QUARTERLY='quarterly',
    YEARLY='yearly',
    CUSTOM='custom'
}

export enum State{
    OPEN='open',
    PAID='paid',
    OVERDUE='overdue',
    CANCELLED='cancelled'
}

@Index(["user", "dueDate", "state"])
@Entity('obligation')
export class Obligation {

    @PrimaryGeneratedColumn('increment', {type: 'bigint'})
    id: number;

    @ManyToOne(() => AuthUser, (user) => user.obligation, {onDelete: 'CASCADE'})
    user: AuthUser

    @Column({type: 'varchar', length: 200})
    title: string;

    @Column({ name: 'amount_total', type: 'decimal', precision: 20, scale:4})
    amountTotal: number;

    @Column({ name: 'amount_remaining', type: 'decimal', precision: 20, scale:4})
    amountRemaining: number;

    @Column({type: 'char', length: 3, default: 'USD'})
    currency: string;

    @Column({name: 'due_date',type: 'datetime', nullable:true})
    dueDate: Date;

    @Column({
        type: 'enum',
        enum: Frequency,
        default: Frequency.ONE_TIME
    })
    frequecy: Frequency;

    @Column({
        type: 'enum',
        enum: State,
        default: State.OPEN
    })
    state: State;

    @CreateDateColumn({ name: 'created_at',type: 'datetime'})
    createdAt: Date;

    @OneToMany(() => Reminder, (reminder) => reminder.obligation)
    reminder: Reminder[]

    @OneToMany(() => NotificationLog, (notifications) => notifications.obligation)
    notifications: NotificationLog[]
}