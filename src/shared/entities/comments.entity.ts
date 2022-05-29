import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("comments")
export class Comments {
  @PrimaryGeneratedColumn()
    coid: number; //Comments id
  
  @Column()
    type: string; //choose `post` or `page`

  @Column()
    cid: number; //Pages/Post id

  @CreateDateColumn()
    created: string;

  @Column()
    author: string;

  @Column()
    email: string;

  // 可选的参数
  @Column({ nullable: true })
    url?: string = null;

  @Column()
    text: string; //Comments content

  // 在建立记录的时候就把后期需要用到的slug直接生成，方便了前端的调用。这是一个原因。
  // 当然这不是重点，通过层次命名的 key，对删除父评论相当方便。
  @Column()
    key: string;

  @Column({ nullable: true })
    ip: string = null;

  @Column({ nullable: true })
    userAgent: string = null;

  @Column()
    status: number;  // 0 need checked, 1 push, 2 shit message

  @Column()
    parent: number; //parent coid
}
