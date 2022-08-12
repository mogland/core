import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { join } from "path";
import { MONGO_DB } from "~/app.config";
import { BACKUP_DIR } from "~/constants/path.constant";
import { CacheService } from "~/processors/cache/cache.service";
import { getMediumDateTime } from "~/utils/time.util";
import { ConfigsService } from "../configs/configs.service";
import mkdirp from "mkdirp";
import { quiet } from "zx-cjs";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { UserService } from "../user/user.service";
import { UserDocument } from "../user/user.model";
import { CategoryService } from "../category/category.service";
import { PostService } from "../post/post.service";
import { PageService } from "../page/page.service";
import { CommentService } from "../comment/comment.service";
import { BackupInterface } from "./backup.interface";
@Injectable()
export class BackupService {
  private logger: Logger;

  constructor(
    private readonly configs: ConfigsService,
    private readonly redis: CacheService,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly postService: PostService,
    private readonly pageService: PageService,
    private readonly commentService: CommentService
  ) {
    this.logger = new Logger(BackupService.name);
  }

  async backup() {
    this.logger.log("正在备份数据库...");
    const dir = getMediumDateTime(new Date());
    const backupPath = join(BACKUP_DIR, dir);
    mkdirp.sync(backupPath);

    try {
      await $`mongodump -h ${MONGO_DB.host} --port ${MONGO_DB.port} -d ${MONGO_DB.dbName} -o ${backupPath} >/dev/null 2>&1`; // 备份数据库
      cd(backupPath); // 进入备份目录
      await nothrow(quiet($`mv ${MONGO_DB.dbName} nx-space`)); // 移动备份文件
      await quiet(
        $`tar -czf nx-space-backup-${dir}.tar.gz nx-space/* && rm -rf nx-space`
      ); // 压缩备份文件，并删除备份目录
      this.logger.log("备份数据库完成");
    } catch (e) {
      this.logger.error(
        `备份数据库失败，请检查是否安装 mongo-tools, mongo-tools 的版本需要与 mongod 版本一致, ${e.message}` ||
        e.stderr
      );
      throw e; // 抛出异常
    }
    const path = join(backupPath, `nx-space-backup-${dir}.tar.gz`);
    return {
      buffer: await readFile(path), // 读取备份文件
      path,
    };
  }

  checkBackupExist(dirname: string) {
    const path = join(BACKUP_DIR, dirname, `nx-space-backup-${dirname}.zip`);
    if (!existsSync(path)) {
      throw new BadRequestException("文件不存在");
    }
    return path;
  }

  async getFileStream(dirname: string) {
    const path = this.checkBackupExist(dirname);
    const stream = fs.createReadStream(path);

    return stream;
  }

  async restore(buffer: Buffer) {
    // 检查buffer是否为tar.gz文件
    if (!buffer.slice(0, 2).toString("hex").includes("1f8b")) {
      throw new Error("不是tar.gz文件");
    }
    // 检查大小
    if (!buffer.length) {
      throw new Error("文件为空");
    }
    this.logger.log("正在还原数据库...");
    const dir = getMediumDateTime(new Date());
    const backupPath = join(BACKUP_DIR, dir);
    mkdirp.sync(backupPath);
    const path = join(backupPath, `nx-space-backup-${dir}.tar.gz`);
    try {
      await writeFile(path, buffer); // 写入备份文件
      cd(backupPath); // 进入备份目录
      await nothrow(quiet($`tar -xzf nx-space-backup-${dir}.tar.gz`)); // 解压备份文件
      await nothrow(
        quiet(
          $`mongorestore -h ${MONGO_DB.host} --port ${MONGO_DB.port} -d ${MONGO_DB.dbName} ./nx-space --drop  >/dev/null 2>&1`
        )
      ); // 还原数据库
      this.logger.log("还原数据库完成");
    } catch (e) {
      this.logger.error(
        `还原数据库失败，请检查是否安装 mongo-tools, mongo-tools 的版本需要与 mongod 版本一致, ${e.message}` ||
        e.stderr
      );
      throw e; // 抛出异常
    }
  }

  async backupWithJSON(json: BackupInterface, user: UserDocument) {
    // const errorLog: string[] = [];
    const { site, master, categories, posts, pages, comments } = json;
    await this.configs.patchAndValidate("site", site);
    await this.userService.patchUserData(user, master);
    categories.forEach(async (category) => {
      await this.categoryService.model.create({
        name: category.name,
        slug: category.slug,
      })
    })
    posts.forEach(async (post) => {
      await this.postService.model.create({
        title: post.title,
        slug: post.slug,
        text: post.text,
        categoryId: post.category,
        tags: post?.tags,
        created: post.created,
        modified: post?.modified,
        summary: post?.summary,
        allowComment: post?.allowComment,
      })
    })
    pages.forEach(async (page) => {
      await this.pageService.model.create({
        title: page.title,
        subtitle: page?.subtitle,
        slug: page.slug,
        text: page.text,
        created: page.created,
        modified: page?.modified,
        summary: page?.summary,
        allowComment: page?.allowComment,
        order: page?.order,
      })
    })

    // const createChildComment = async (children) => {
    //   children.map(async (comment) => {
    //     await this.commentService.validateName(comment.author);
    //     const children = comment.children || [];
    //     const ref = comment.refType
    //     delete comment.children;
    //     const parent = await this.commentService.model.findById(id).populate("ref");
    //     if (!parent) {
    //       throw new CannotFindException();
    //     }
    //     const commentIndex = parent.commentsIndex; // 获取评论的索引
    //     const key = `${parent.key}#${commentIndex}`;
    //     await this.commentService.create(refPostId, {
    //       refType: ref,
    //       author: comment.author,
    //       text: comment.text,
    //       created: comment.created,
    //       urls: comment?.urls,
    //       ip: comment?.ip,
    //       status: comment?.status,
    //       agent: comment?.agent,
    //     }, ref)
    //   })
    // }

    // comments.forEach(async (comment) => {
    //   await this.commentService.validateName(comment.author);
    //   const children = comment.children || [];
    //   const ref = comment.refType
    //   delete comment.children;
    //   const refPostId = await this.postService.getPostBySlug(ref).then(post => post?._id);
    //   if (!refPostId) {
    //     errorLog.push(`${comment.author} 的评论找不到文章 ${ref}`);
    //     this.logger.error(`评论 ${comment.author} 的文章 ${ref} 不存在`);
    //   }
    //   await this.commentService.create(refPostId, {
    //     refType: ref,
    //     author: comment.author,
    //     text: comment.text,
    //     created: comment.created,
    //     urls: comment?.urls,
    //     ip: comment?.ip,
    //     status: comment?.status,
    //     agent: comment?.agent,
    //   }, ref)

    //   await createChildComment(children);

    // })
  }
}
