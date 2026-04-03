import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRecordDto, UpdateRecordDto, FilterRecordDto } from './dto/record.dto';
import { Prisma } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class RecordsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async create(userId: string, createRecordDto: CreateRecordDto) {
    return this.prisma.$transaction(async (tx) => {
      const record = await tx.record.create({
        data: {
          userId,
          ...createRecordDto,
          date: new Date(createRecordDto.date),
        },
      });

      await this.auditService.logAction(tx, userId, 'CREATE', 'Record', record.id);
      return record;
    });
  }

  async findAll(filterDto: FilterRecordDto, callerId: string, callerRole: string) {
    const where: Prisma.RecordWhereInput = {};

    // Non-admin users only see their own records
    if (callerRole !== 'ADMIN') {
      where.userId = callerId;
    }

    if (filterDto.type) {
      where.type = filterDto.type;
    }
    if (filterDto.category) {
      where.category = { contains: filterDto.category, mode: 'insensitive' };
    }
    if (filterDto.startDate || filterDto.endDate) {
      where.date = {};
      if (filterDto.startDate) where.date.gte = new Date(filterDto.startDate);
      if (filterDto.endDate) where.date.lte = new Date(filterDto.endDate);
    }

    const page = filterDto.page && filterDto.page > 0 ? filterDto.page : 1;
    const limit = filterDto.limit && filterDto.limit > 0 ? filterDto.limit : 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.record.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.record.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total },
    };
  }

  async findOne(id: string, callerId: string, callerRole: string) {
    const record = await this.prisma.record.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Record not found');
    this.assertOwnership(record.userId, callerId, callerRole);
    return record;
  }

  async update(id: string, updateRecordDto: UpdateRecordDto, callerId: string, callerRole: string) {
    const existing = await this.prisma.record.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Record not found');
    this.assertOwnership(existing.userId, callerId, callerRole);

    const data: Prisma.RecordUpdateInput = {
      ...(updateRecordDto.amount !== undefined && { amount: updateRecordDto.amount }),
      ...(updateRecordDto.type !== undefined && { type: updateRecordDto.type }),
      ...(updateRecordDto.category !== undefined && { category: updateRecordDto.category }),
      ...(updateRecordDto.description !== undefined && { description: updateRecordDto.description }),
      ...(updateRecordDto.date !== undefined && { date: new Date(updateRecordDto.date) }),
    };

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.record.update({ where: { id }, data });
      await this.auditService.logAction(tx, callerId, 'UPDATE', 'Record', id);
      return updated;
    });
  }

  async remove(id: string, callerId: string, callerRole: string) {
    const existing = await this.prisma.record.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Record not found');
    this.assertOwnership(existing.userId, callerId, callerRole);

    return this.prisma.$transaction(async (tx) => {
      const deleted = await tx.record.delete({ where: { id } });
      await this.auditService.logAction(tx, callerId, 'DELETE', 'Record', id);
      return deleted;
    });
  }

  private assertOwnership(recordUserId: string, callerId: string, callerRole: string) {
    if (callerRole !== 'ADMIN' && recordUserId !== callerId) {
      throw new ForbiddenException('You do not have access to this record');
    }
  }
}
