import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  title: string;

  @Column("text")
  path: string;

  @Column()
  content: string;
}
