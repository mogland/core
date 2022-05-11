import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("pages")
export class Pages {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({ length: 500 })
    title: string;

  @Column("text")
    path: string;

  @Column("text")
    content: string;

  @Column("datetime")
    createdAt: Date;

  @Column("datetime")
    updatedAt: Date;
}
