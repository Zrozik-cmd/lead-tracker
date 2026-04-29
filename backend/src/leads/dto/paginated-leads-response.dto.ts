import { ApiProperty } from '@nestjs/swagger';

export class PaginatedLeadsResponseDto {
  @ApiProperty({ description: 'Array of leads', type: Object, isArray: true })
  data!: any[];

  @ApiProperty({ description: 'Total number of leads', example: 100 })
  total!: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page!: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  limit!: number;
}
