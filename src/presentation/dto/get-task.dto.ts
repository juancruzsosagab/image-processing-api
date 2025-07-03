import { IsString, IsNotEmpty } from 'class-validator';

export class GetTaskDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
