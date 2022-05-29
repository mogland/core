import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

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

  @Column("text")
    views: number;

  @Column("text")
    thumbs: number;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;

}
