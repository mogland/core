import { ApiProperty } from "@nestjs/swagger"

export class CreateHostDto {
    id: number = 1
    @ApiProperty()
    readonly name: string = "wibus"
    @ApiProperty()
    readonly description: string = "Just Uaeua"
    @ApiProperty()
    readonly image: string = ""
}
