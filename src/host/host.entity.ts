/*
 * @FilePath: /Nest-server/host/host.entity.ts
 * @author: Wibus
 * @Date: 2021-10-01 17:16:38
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-03 13:48:51
 * Coding With IU
 */
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Host {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column("text")
  description?: string;

  @Column()
  image: string;
}
