/*
 * @FilePath: /nx-core/src/shared/dto/file.dto.ts
 * @author: Wibus
 * @Date: 2022-07-18 20:37:11
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-18 20:37:12
 * Coding With IU
 */
import { ApiProperty } from "@nestjs/swagger";

export class FileUploadDto {
  @ApiProperty({ type: "string", format: "binary" })
  file: any;
}
