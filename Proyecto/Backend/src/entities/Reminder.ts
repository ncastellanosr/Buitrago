import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  OneToMany,
  ManyToOne
} from "typeorm";
import { AuthUser } from "./AuthUser";
import { Obligation } from "./Obligation";
import { Account } from "./Account";
import { NotificationLog } from "./NotificationLog";

@Index(["user", "remindAt", "isSent"])
@Entity('reminder')
export class Reminder{

    @PrimaryGeneratedColumn('increment',{type: 'bigint'})
    id: number;

    @ManyToOne(() => AuthUser, (user) => user.reminder, {onDelete: 'CASCADE', nullable:false})
    user: AuthUser

    @ManyToOne(() => Obligation, (obligation) => obligation.reminder, {onDelete: 'SET NULL', nullable:true})
    obligation: Obligation

    @ManyToOne(() => Account, (account) => account.reminder, {onDelete: 'SET NULL', nullable:true})
    account: Account

    @Column({type: 'varchar', length: 200})
    title: string;

    @Column({type: 'text', nullable: true})
    message: string;

    @Column({name: 'remind_at', type: 'datetime'})
    remindAt: Date;

    @Column({ name: 'channel_set', type: 'json'})
    channelSet: object | null;

    @Column({name: 'is_sent', type: 'boolean', default: false})
    isSent: boolean;

    @CreateDateColumn({name: 'created_at', type: 'datetime'})
    createdAt: Date;

    @OneToMany(() => NotificationLog, (notifications) => notifications.reminder)
    notifications: NotificationLog[]

}