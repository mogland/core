import { MultipartFile } from "@fastify/multipart";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Post,
  Req,
} from "@nestjs/common";
import { ApiOperation, ApiResponseProperty } from "@nestjs/swagger";
import { FastifyRequest } from "fastify";
import { Readable } from "stream";
import { Auth } from "~/common/decorator/auth.decorator";
import { CurrentUser } from "~/common/decorator/current-user.decorator";
import { Bypass, FileUpload } from "~/common/decorator/http.decorator";
import { ApiName } from "~/common/decorator/openapi.decorator";
import { getMediumDateTime } from "~/utils/time.util";
import { UserDocument } from "../user/user.model";
import { BackupInterface } from "./backup.interface";
import { BackupService } from "./backup.service";

@Controller("backup")
@ApiName
@Auth()
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post("/json")
  @ApiOperation({ summary: "使用 json 恢复数据" })
  async backupWithJSON(@Body() body: BackupInterface, @CurrentUser() user: UserDocument){
    return await this.backupService.backupWithJSON(body, user);
  }

  @Get("/new")
  @ApiResponseProperty({ type: "string", format: "binary" })
  @ApiOperation({ summary: "新建备份" })
  @Header(
    "Content-Disposition", // Content-Disposition HTTP 响应头，用来告诉浏览器如何处理下载的文件。
    `attachment; filename="nx-space-backup-${getMediumDateTime(
      new Date()
    )}.tar.gz"` // filename 参数用来告诉浏览器下载的文件名。 attachment 参数用来告诉浏览器，文件是附件，而不是直接显示。
  )
  @Bypass
  async createNewBackup() {
    const res = await this.backupService.backup();
    if (typeof res == "undefined" || typeof res.buffer === "undefined") {
      throw new BadRequestException("备份时遇到了一个预期外的错误o_O");
    }
    const stream = new Readable();
    stream.push(res.buffer);
    stream.push(null);
    return stream;
  }

  private async ValidMultipartFields(
    req: FastifyRequest
  ): Promise<MultipartFile> {
    const data = await req.file();

    if (!data) {
      throw new BadRequestException("仅供上传文件!");
    }
    if (data.fieldname != "file") {
      throw new BadRequestException("字段必须为 file");
    }

    return data;
  }

  @Post("/restore")
  @ApiOperation({ summary: "恢复备份" })
  // 告诉浏览器上传文件的类型
  @FileUpload({ description: "上传并且恢复备份文件" })
  async restoreBackup(@Req() req: FastifyRequest) {
    const data = await this.ValidMultipartFields(req);
    const { mimetype } = data;
    // 如果不是 tar.gz 文件，则抛出异常
    if (mimetype != "application/x-gzip") {
      throw new BadRequestException("仅支持 tar.gz 文件");
    }

    await this.backupService.restore(await data.toBuffer());
    return "恢复成功";
  }
}
