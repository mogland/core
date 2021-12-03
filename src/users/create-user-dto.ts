import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  id = 1;
  @ApiProperty()
  readonly name: string = "wibus";
  @ApiProperty()
  readonly password: string = "wibus";
}
