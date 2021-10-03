import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {
    // @ApiProperty()
    id: number
    @ApiProperty()
    title: string
    @ApiProperty()
    path: string
    @ApiProperty()
    tags: string
    @ApiProperty()
    slug: string

}
