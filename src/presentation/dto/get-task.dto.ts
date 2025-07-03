import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTaskDto {
  @ApiProperty({ description: 'Task ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
