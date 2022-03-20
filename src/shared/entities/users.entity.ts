/*
 * @FilePath: /GS-server/src/shared/entities/users.entity.ts
 * @author: Wibus
 * @Date: 2021-10-03 15:35:23
 * @LastEditors: Wibus
 * @LastEditTime: 2022-03-20 17:38:53
 * Coding With IU
 */
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class Users {
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
