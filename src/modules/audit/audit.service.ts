import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async logAction(
    tx: Prisma.TransactionClient | null,
    userId: string,
    action: string,
    entity: string,
    entityId: string,
  ) {
    const db = tx ?? this.prisma;
    return db.auditLog.create({
      data: { userId, action, entity, entityId },
    });
  }
}
