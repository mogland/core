import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
    id: number = 1
    @ApiProperty()
    readonly name: string = "wibus"
    @ApiProperty()
    readonly password: string = "wibus"
}
