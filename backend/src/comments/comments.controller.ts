import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Comment } from '@prisma/client';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Comments')
@Controller('api/leads/:leadId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment for a lead' })
  @ApiParam({ name: 'leadId', description: 'ID of the lead' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  create(
    @Param('leadId') leadId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    // Ensure leadId matches
    createCommentDto.leadId = leadId;
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments for a lead' })
  @ApiParam({ name: 'leadId', description: 'ID of the lead' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  findByLeadId(@Param('leadId') leadId: string): Promise<Comment[]> {
    return this.commentsService.findByLeadId(leadId);
  }
}
