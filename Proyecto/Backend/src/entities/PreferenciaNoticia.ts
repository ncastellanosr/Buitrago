import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  JoinColumn,
} from "typeorm";
import { AuthUser } from "./AuthUser";

@Entity('preferencia_noticia')
@Unique(["user", "category"]) 
export class PreferenciaNoticia{

    @PrimaryGeneratedColumn('increment', { type: 'bigint', name: "preferencia_id",})
    id: number;

    @ManyToOne(() => AuthUser, (user) => user.preferencias, {onDelete:'CASCADE', nullable: false,})
    @JoinColumn({ name: "user_id" })
    user: AuthUser;
  
    @Column( {type: 'varchar', length: 100})
    category: string;

    @Column({ type: "tinyint", width: 1, default: 1 })
    priority: boolean;

}