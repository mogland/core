import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

class DbQueryBasicDto {
  @IsOptional()
  db_query?: any;
}

export class PagerDto extends DbQueryBasicDto {
  @Min(1)
  @Max(50)
  @IsInt()
  @Expose()
  @Transform(({ value: val }) => (val ? parseInt(val) : 10), {
    toClassOnly: true,
  })
  @ApiProperty({ example: 10 })
  size: number;

  @Transform(({ value: val }) => (val ? parseInt(val) : 1), {
    toClassOnly: true,
  })
  @Min(1)
  @IsInt()
  @Expose()
  @ApiProperty({ example: 1 })
  page: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  select?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum([1, -1])
  @Transform(({ value: val }) => {
    // @ts-ignore
    const isStringNumber = typeof val === "string" && !isNaN(val);

    if (isStringNumber) {
      return parseInt(val);
    } else {
      return {
        asc: 1,
        desc: -1,
      }[val.toString()];
    }
  })
  sortOrder?: 1 | -1;

  @IsOptional()
  @Transform(({ value: val }) => parseInt(val))
  @Min(1)
  @IsInt()
  @ApiProperty({ example: 2020 })
  year?: number;

  @IsOptional()
  @Transform(({ value: val }) => parseInt(val))
  @IsInt()
  state?: number;
}
