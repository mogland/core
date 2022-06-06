/*
 * @FilePath: /nx-server/src/shared/entities/categories.entity.ts
 * @author: Wibus
 * @Date: 2021-10-07 17:01:46
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-06 22:42:12
 * Coding With IU
 */
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("categories")
export class Categories {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    name: string;

  @Column()
    slug: string;
}
