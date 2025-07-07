import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsValidPath } from './validators/is-valid-path.validator';

export class CreateTaskDto {
  @ApiProperty({ description: 'Path or URL of the original image' })
  @IsString()
  @IsNotEmpty()
  @IsValidPath({
    message: 'originalPath must be a valid URL or existing local file path',
  })
  originalPath: string;
}
