import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface MonthlyTrendRow {
  month: Date;
  type: string;
  total: number;
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const aggregations = await this.prisma.record.groupBy({
      by: ['type'],
      _sum: { amount: true },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    for (const agg of aggregations) {
      const amount = Number(agg._sum.amount ?? 0);
      if (agg.type === 'INCOME') totalIncome = amount;
      if (agg.type === 'EXPENSE') totalExpense = amount;
    }

    return {
      totalIncome,
      totalExpenses: totalExpense,
      netBalance: totalIncome - totalExpense,
    };
  }

  async getCategoryBreakdown() {
    const aggregations = await this.prisma.record.groupBy({
      by: ['category', 'type'],
      _sum: { amount: true },
    });

    return aggregations.map((agg) => ({
      category: agg.category,
      type: agg.type,
      total: Number(agg._sum.amount ?? 0),
    }));
  }

  async getRecentTransactions(limit = 5) {
    return this.prisma.record.findMany({
      orderBy: { date: 'desc' },
      take: limit,
      select: {
        id: true,
        amount: true,
        type: true,
        category: true,
        date: true,
        description: true,
      },
    });
  }

  async getMonthlyTrends() {
    const rows = await this.prisma.$queryRaw<MonthlyTrendRow[]>`
      SELECT
        DATE_TRUNC('month', "date") AS month,
        "type",
        SUM("amount")::float AS total
      FROM "Record"
      GROUP BY month, "type"
      ORDER BY month ASC
    `;

    const trends: Record<string, { income: number; expense: number }> = {};
    for (const row of rows) {
      const key = new Date(row.month).toISOString().slice(0, 7);
      if (!trends[key]) trends[key] = { income: 0, expense: 0 };
      if (row.type === 'INCOME') trends[key].income = row.total;
      if (row.type === 'EXPENSE') trends[key].expense = row.total;
    }

    return trends;
  }
}
