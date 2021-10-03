/*
 * @FilePath: /nest-server/users/user.entity.ts
 * @author: Wibus
 * @Date: 2021-10-03 15:35:23
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-03 15:35:24
 * Coding With IU
 */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500})
  name: string;

  @Column('text')
  password: string;

}