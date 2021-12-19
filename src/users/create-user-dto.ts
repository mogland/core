import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  readonly name: string = "wibus";
  @ApiProperty()
  readonly password: string = "wibus";
}
