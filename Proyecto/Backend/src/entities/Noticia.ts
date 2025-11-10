import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from "typeorm";

@Entity('noticia')
export class Noticia{

    @PrimaryGeneratedColumn('increment', {type: 'bigint'})
    id: number;

    @Column({type: 'varchar', length: 200})
    source: string;

    @Column({ type: 'varchar', length: 300})
    title: string;

    @Column({ type: 'text'})
    content: string;

    @Index()
    @Column({ type: 'varchar', length: 100})
    category: string;

    @Column({ type: 'varchar', length: 500})
    url: string;

    @Index()
    @Column({ name: 'published_at',type: 'datetime'})
    publishedAt: Date;

    @Column({ name: 'raw_playload', type: 'json', nullable: true})
    rawPayload: JSON;
}