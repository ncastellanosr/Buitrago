import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { AuthUser } from "./AuthUser";

@Entity('preferencia_noticia')
export class PreferenciaNoticia{

    @PrimaryGeneratedColumn('increment', { type: 'bigint'})
    id: number;

    @ManyToOne(() => AuthUser, (user) => user.preferencias, {onDelete:'CASCADE', nullable: false})
    user: AuthUser;

    @Column( {type: 'varchar', length: 100, unique:true})
    category: string;

    @Column( {type: 'boolean', default: true})
    priority: boolean;

}