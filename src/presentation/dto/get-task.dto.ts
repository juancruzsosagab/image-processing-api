import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTaskDto {
  @ApiProperty({
    description: 'Task ID (must be a valid MongoDB ObjectId)',
    example: '64c49f2a2f1b2a6d8a123456',
  })
  @IsMongoId({ message: 'The id must be a valid MongoDB ObjectId' })
  id: string;
}
