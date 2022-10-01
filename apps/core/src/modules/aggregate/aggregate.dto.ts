import { Transform } from 'class-transformer';
import { Min, Max, IsOptional } from 'class-validator';

export class TopQueryDto {
  @Transform(({ value: val }) => parseInt(val))
  @Min(1)
  @Max(10)
  @IsOptional()
  size?: number;
}
