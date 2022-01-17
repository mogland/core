/*
 * @FilePath: /GS-server/src/modules/friends/friends.entity.ts
 * @author: Wibus
 * @Date: 2021-10-23 08:57:19
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-16 16:39:03
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
    owner: boolean;

  @Column()
    check: boolean;
}
