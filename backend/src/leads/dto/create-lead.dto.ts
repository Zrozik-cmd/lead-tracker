import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  IN_PROGRESS = 'IN_PROGRESS',
  WON = 'WON',
  LOST = 'LOST',
}

export class CreateLeadDto {
  @ApiProperty({ description: 'Name of the lead', example: 'John Doe' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    description: 'Email of the lead',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Company of the lead',
    example: 'Acme Corp',
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({
    description: 'Status of the lead',
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiPropertyOptional({ description: 'Value of the lead', example: 1000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @ApiPropertyOptional({
    description: 'Notes about the lead',
    example: 'Interested in our services',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
