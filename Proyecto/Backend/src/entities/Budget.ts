import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne
} from "typeorm";
import { AuthUser } from "./AuthUser";
import { Category } from "./Category";

export enum Period {
    MONTHLY='monthly',
    QUARTERLY='quarterly',
    YEARLY='yearly'
}

@Entity('budget')
export class Budget{

    @PrimaryGeneratedColumn('increment', {type: 'bigint'})
    id: number;

    @ManyToOne(() => AuthUser, (user) => user.budget, {onDelete: 'CASCADE', nullable:false})
    user: AuthUser

    @ManyToOne(() => Category, (category) => category.budget, {onDelete: 'CASCADE', nullable:false})
    category: Category

    @Column({
        type: 'enum',
        enum: Period,
        default: Period.MONTHLY,
        unique: true
    })
    period: Period;

    @Column({ name: 'amount_limit', type: 'decimal', precision: 20, scale: 4})
    amountLimit: number;

    @CreateDateColumn({name: 'start_date', type: 'datetime', unique: true})
    startDate: Date;

    @Column({ name: 'end_date', type: 'datetime', nullable:true})
    endDate: Date;

    @CreateDateColumn({name: 'created_at', type: 'datetime'})
    createdAt: Date;

}