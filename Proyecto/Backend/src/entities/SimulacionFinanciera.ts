import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { AuthUser } from "./AuthUser";

export enum SimType{
    CDT='cdt',
    CREDIT_LINE='credit_line',
    STOCK_EVAL='stock_eval',
    LOAN_CALC='loan_calc',
    CUSTOM='custom'
}

@Entity('simulacion_financiera')
export class SimulacionFinanciera{

    @PrimaryGeneratedColumn('increment', {type: 'bigint'})
    id: number;
    
    @ManyToOne(() => AuthUser, (user) => user.simulaciones, {onDelete: 'CASCADE', nullable:false} )
    user: AuthUser

    @Column({
        name: 'sim_type',
        type: 'enum',
        enum: SimType,
        default: SimType.CUSTOM
    })
    simType: SimType

    @Column({ type: 'json'})
    parameters: JSON;

    @Column({ type: 'json', nullable:true})
    result: JSON;

    @CreateDateColumn({ name: 'created_at', type: 'datetime'})
    createdAt: Date

}