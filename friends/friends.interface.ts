import { ApiProperty } from "@nestjs/swagger"

export class CreateLinks {
    @ApiProperty({example: 'Wibus'})
    name: string
    @ApiProperty({example: 'https://iucky.cn/'})
    website: string
    @ApiProperty({
        example: "0"
    })
    check?: number
    @ApiProperty()
    image?: string
    @ApiProperty()
    desc?: string
}
