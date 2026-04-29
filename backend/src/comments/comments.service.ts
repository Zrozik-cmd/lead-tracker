import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    // Check if lead exists
    const lead = await this.prisma.lead.findUnique({
      where: { id: createCommentDto.leadId },
    });
    if (!lead) {
      throw new NotFoundException(
        `Lead with ID ${createCommentDto.leadId} not found`,
      );
    }

    return this.prisma.comment.create({
      data: createCommentDto,
    });
  }

  async findByLeadId(leadId: string): Promise<Comment[]> {
    // Check if lead exists
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${leadId} not found`);
    }

    return this.prisma.comment.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
