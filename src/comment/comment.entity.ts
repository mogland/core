import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  cid: number; //comment id

  @Column()
  type: string; //choose `post` or `page`

  @Column()
  path: string;

  @PrimaryGeneratedColumn("uuid")
  post: string; //only ID

  @Column()
  content: string; //comment content

  @CreateDateColumn()
  createTime: number;

  @Column()
  author: string;

  @Column()
  owner: string;

  @Column()
  isOwner: number;

  @Column()
  email: string;

  @Column()
  url?: string = null;

  // 在建立记录的时候就把后期需要用到的slug直接生成，方便了前端的调用。这是一个原因。
  // 当然这不是重点，通过层次命名的 key，对删除父评论相当方便。
  @Column()
  key?: string = null;

  @Column()
  hasChild: number;

  @Column()
  ipAddress?: string = null;

  @Column()
  userAgent?: string = null;

  @Column()
  state: number; 
}
