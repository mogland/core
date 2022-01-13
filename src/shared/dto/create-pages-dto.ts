import { ApiProperty } from "@nestjs/swagger";

export class CreatePagesDto {
  // @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  content: string;
}
