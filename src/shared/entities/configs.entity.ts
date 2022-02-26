/*
 * @FilePath: /GS-server/src/shared/entities/configs.entity.ts
 * @author: Wibus
 * @Date: 2022-02-26 18:07:54
 * @LastEditors: Wibus
 * @LastEditTime: 2022-02-26 18:14:43
 * Coding With IU
 */

import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Configs {
  @PrimaryGeneratedColumn()
    id: number;
  @Column()
    name: string;
  @Column()
    user: string;
  @Column()
    value: string;
  
}
