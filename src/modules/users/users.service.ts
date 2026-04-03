import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
      }),
      this.prisma.user.count(),
    ]);
    return { data, meta: { page, limit, total } };
  }

  async updateRole(id: string, role: Role, actorId: string = 'system') {
    await this.findById(id); 
    
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id },
        data: { role },
        select: { id: true, email: true, name: true, role: true },
      });
      await this.auditService.logAction(tx, actorId, 'UPDATE_ROLE', 'User', id);
      return updated;
    });
  }

  async toggleActive(id: string, isActive: boolean, actorId: string = 'system') {
    await this.findById(id); 
    
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id },
        data: { isActive },
        select: { id: true, email: true, name: true, isActive: true },
      });
      await this.auditService.logAction(tx, actorId, 'TOGGLE_ACTIVE', 'User', id);
      return updated;
    });
  }
}
