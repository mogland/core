import { Entity, Column, PrimaryGeneratedColumn, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    cid: number; //comment id

    @Column()
    type: string //choose `post` or `page`

    @Column()
    path: string

    @ObjectIdColumn()
    post: ObjectID //only ID

    @Column()
    content: string //comment content

    @Column()
    createTime: number = Date.now()

    @Column()
    author: string

    @Column()
    owner: String

    @Column()
    isOwner: Boolean

    @Column()
    email: string

    @Column()
    url?: string

    @Column()
    key: String

    @ObjectIdColumn()
    parent: ObjectID

    @Column()
    hasChild: Boolean = false

    @Column()
    ipAddress: string

    @Column()
    userAgent: string

    @Column()
    state: number = 0 // 0 need checked, 1 push, 2 shit message

}