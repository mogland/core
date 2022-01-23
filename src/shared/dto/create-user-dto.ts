import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  readonly uuid?: string;

  @ApiProperty()
  readonly name: string = "wibus";
  @ApiProperty()
    password: string;

  @ApiProperty()
  readonly lovename?: string;

  @ApiProperty()
  readonly description?: string;

  @ApiProperty()
  readonly email?: string;

  @ApiProperty()
  readonly avatar?: string;
  
  @ApiProperty()
  readonly level: string; // master, admin, user

  @ApiProperty()
  readonly status: string; // active, inactive, banned

  @ApiProperty()
  readonly QQ?: string;
}
