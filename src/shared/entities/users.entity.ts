/*
 * @FilePath: /GS-server/src/modules/users/users.entity.ts
 * @author: Wibus
 * @Date: 2021-10-03 15:35:23
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-19 21:53:00
 * Coding With IU
 */
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
    uuid: string;

  @Column({ length: 500 })
    name: string;

  @Column("text")
    password: string;

  @Column("text")
    lovename: string;
  
  @Column("text")
    description: string;

  @Column("text")
    email: string;

  @Column("text")
    avatar: string;
  
  @Column("text")
    level: string; // master, admin, user

  @Column("text")
    status: string; // active, inactive, banned

  @Column("text")
    QQ: string;

}
