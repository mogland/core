/*
 * @FilePath: /GS-server/src/shared/entities/friends.entity.ts
 * @author: Wibus
 * @Date: 2021-10-23 08:57:19
 * @LastEditors: Wibus
 * @LastEditTime: 2022-02-12 18:44:36
 * Coding With IU
 */
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Friends {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({ length: 500 })
    name: string;

  @Column("text")
    description?: string;

  @Column()
    website: string;

  @Column()
    image: string;

  @Column()
    qq: string;

  @Column()
    owner: number;

  @Column()
    check: number;
}
