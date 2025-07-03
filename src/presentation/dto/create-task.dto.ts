import { IsString, IsUrl } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsUrl({}, { message: 'originalPath must be a valid URL or path' })
  originalPath: string;
}
