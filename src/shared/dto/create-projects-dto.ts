import { ApiProperty } from "@nestjs/swagger";

/*
 * @FilePath: /GS-server/src/shared/dto/create-projects-dto.ts
 * @author: Wibus
 * @Date: 2022-02-26 23:42:15
 * @LastEditors: Wibus
 * @LastEditTime: 2022-02-26 23:44:28
 * Coding With IU
 */
export class CreateProjectsDto {
  pid: number; //Project id

  @ApiProperty()
    name: string;

  @ApiProperty()
    description: string;

  @ApiProperty()
    content: string;

  @ApiProperty()
    demo: string;

  @ApiProperty()
    openSource: string
  
  @ApiProperty()
    pictures: string[];

  @ApiProperty()
    icon: string;

}