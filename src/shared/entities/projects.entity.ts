import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/*
 * @FilePath: /GS-server/src/shared/entities/projects.entity.ts
 * @author: Wibus
 * @Date: 2022-02-26 23:44:42
 * @LastEditors: Wibus
 * @LastEditTime: 2022-03-20 17:26:03
 * Coding With IU
 */
@Entity('projects')
export class Projects {
  @PrimaryGeneratedColumn()
    pid: number; //Project id

  @Column('text')
    name: string;

  @Column('text')
    description: string;

  @Column('text')
    content: string;

  @Column('text')
    demo: string;

  @Column('text')
    openSource: string
  
  @Column('text')
    pictures: string[];

  @Column('text')
    icon: string;

}