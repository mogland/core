/*
 * @FilePath: /GS-server/src/shared/entities/category.entity.ts
 * @author: Wibus
 * @Date: 2021-10-07 17:01:46
 * @LastEditors: Wibus
 * @LastEditTime: 2022-02-09 16:06:24
 * Coding With IU
 */
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
    id?: number;

  @Column()
    name: string;

  @Column()
    slug: string;
}
