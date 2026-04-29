import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

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

  @ApiProperty({
    description: 'ID of the lead this comment belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  leadId!: string;
}
