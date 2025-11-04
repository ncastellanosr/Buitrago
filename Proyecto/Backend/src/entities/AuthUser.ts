import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index
} from "typeorm";

// Aqui va lo que sea no me acuerdo de los roles que habian
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  GUEST = 'guest',
}

// Este triple hijueputa mounstruo hace un mapeo de la tabla a una clase o algo asi
@Entity('auth_user')
export class AuthUser {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  userId: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  name: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @Column({ name: 'last_login', type: 'datetime', nullable: true })
  lastLogin: Date | null;

  @Column({ type: 'tinyint', width: 1, default: 1 })
  isActive: boolean;

  @Column({ type: 'json', nullable: true })
  metadata: object | null;
}
