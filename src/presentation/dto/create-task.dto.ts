import { IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: 'Path or URL of the original image' })
  @IsString()
  @IsUrl({}, { message: 'originalPath must be a valid URL or path' })
  originalPath: string;
}
