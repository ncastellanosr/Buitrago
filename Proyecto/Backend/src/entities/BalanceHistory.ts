import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne
} from "typeorm";
import { AuthUser } from "./AuthUser";

@Index(["user", "snapshotDate"])
@Entity('balance_history')
export class BalanceHistory{

    @PrimaryGeneratedColumn('increment', {type: 'bigint'})
    id: number;

    @ManyToOne(() => AuthUser, (user) => user.balanceHistory, {onDelete: 'CASCADE'})
    user: AuthUser

    @Column({ name: 'snapshot_date', type: 'datetime'})
    snapshotDate: Date;

    @Column({ name: 'total_balance', type: 'decimal', precision: 20, scale: 4})
    totalBalance: number;

    @Column({type: 'json', nullable: true})
    payload: object | null;

    @CreateDateColumn({ name: 'created_at', type: 'datetime'})
    createdAt: Date;

}