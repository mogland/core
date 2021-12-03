/*
 * @FilePath: /GS-server/category/category.entity.ts
 * @author: Wibus
 * @Date: 2021-10-07 17:01:46
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-07 17:01:47
 * Coding With IU
 */
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;
}
