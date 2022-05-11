import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreatePostDto {
  // @ApiProperty()
  id?: number;

  @ApiProperty()
    title: string;

  @ApiProperty()
    path: string;

  @ApiProperty()
    tags: string;

  @ApiProperty()
    slug: string;

  @ApiProperty()
    content: string;
  
  createdAt?: Date;
  updatedAt?: Date;
}
