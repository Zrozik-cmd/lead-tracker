import { Injectable, NotFoundException } from '@nestjs/common';
import { Lead } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateLeadDto, LeadStatus } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    return this.prisma.lead.create({
      data: {
        ...createLeadDto,
        status: createLeadDto.status || LeadStatus.NEW,
      },
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: LeadStatus,
    sort: 'createdAt' | 'updatedAt' = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ): Promise<{ data: Lead[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const allowedSort = ['createdAt', 'updatedAt'] as const;
    const allowedOrder = ['asc', 'desc'] as const;
    const sortField = allowedSort.includes(sort) ? sort : 'createdAt';
    const sortOrder = allowedOrder.includes(order) ? order : 'desc';

    const [data, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortField]: sortOrder },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: { comments: true },
    });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    try {
      return await this.prisma.lead.update({
        where: { id },
        data: updateLeadDto,
      });
    } catch (error) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<Lead> {
    try {
      return await this.prisma.lead.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
  }
}
