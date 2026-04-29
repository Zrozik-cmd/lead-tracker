import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Text of the comment',
    example: 'This is a comment',
    minLength: 1,
    maxLength: 500,
  })
  @IsString()
  @Length(1, 500)
  text!: string;
}
