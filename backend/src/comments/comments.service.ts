import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(
    leadId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${leadId} not found`);
    }

    return this.prisma.comment.create({
      data: {
        text: createCommentDto.text,
        leadId,
      },
    });
  }

  async findByLeadId(leadId: string): Promise<Comment[]> {
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
