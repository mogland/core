/*
 * @FilePath: /nx-server/src/shared/entities/configs.entity.ts
 * @author: Wibus
 * @Date: 2022-02-26 18:07:54
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-06 23:23:27
 * Coding With IU
 */

import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("configs")
export class Configs {
  @PrimaryGeneratedColumn()
    id: number;
  @Column("text")
    name: string;
  // @Column()
  //   user: string;
  @Column("text")
    value: any;
  
}
