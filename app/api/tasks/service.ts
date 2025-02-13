import 'server-only';

import { and, asc, count, desc, eq, gt, gte, ilike, inArray, lte } from 'drizzle-orm';

import { filterColumns } from '@/lib/filter-columns';

import type { GetModelSchema } from '@/app/(private)/tasks/_lib/validations';
import type { Model } from '@/app/(private)/tasks/model/schema';
import { modelSchema } from '@/app/(private)/tasks/model/schema';
import { db } from '@/db';

export async function getModelCollection(input: GetModelSchema) {
  try {
    const offset = (input.page - 1) * input.perPage;
    const fromDate = input.from ? new Date(input.from) : undefined;
    const toDate = input.to ? new Date(input.to) : undefined;
    const advancedTable = input.flags.includes('advancedTable');

    const advancedWhere = filterColumns({
      table: modelSchema,
      filters: input.filters,
      joinOperator: input.joinOperator
    });

    const where = advancedTable
      ? advancedWhere
      : and(
          input.title ? ilike(modelSchema.title, `%${input.title}%`) : undefined,
          input.status.length > 0 ? inArray(modelSchema.status, input.status) : undefined,
          input.priority.length > 0 ? inArray(modelSchema.priority, input.priority) : undefined,
          fromDate ? gte(modelSchema.createdAt, fromDate) : undefined,
          toDate ? lte(modelSchema.createdAt, toDate) : undefined
        );

    const orderBy =
      input.sort.length > 0
        ? input.sort.map((item) =>
            item.desc ? desc(modelSchema[item.id]) : asc(modelSchema[item.id])
          )
        : [asc(modelSchema.createdAt)];

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(modelSchema)
        .limit(input.perPage)
        .offset(offset)
        .where(where)
        .orderBy(...orderBy);

      const total = await tx
        .select({
          count: count()
        })
        .from(modelSchema)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0);

      return {
        data,
        total
      };
    });

    const pageCount = Math.ceil(total / input.perPage);
    return { data, pageCount };
  } catch {
    return { data: [], pageCount: 0 };
  }
}

export async function getModelData(input: { id: string }): Promise<Model | null> {
  try {
    const data = await db
      .select()
      .from(modelSchema)
      .where(eq(modelSchema.id, input.id))
      .then((res) => res[0] || null);
    return data;
  } catch {
    return null;
  }
}

export async function getModelStatusCounts() {
  try {
    return await db
      .select({
        name: modelSchema.status,
        count: count()
      })
      .from(modelSchema)
      .groupBy(modelSchema.status)
      .having(gt(count(), 0))
      .execute();
  } catch {
    return [];
  }
}

export async function getModelPriorityCounts() {
  try {
    return await db
      .select({
        name: modelSchema.priority,
        count: count()
      })
      .from(modelSchema)
      .groupBy(modelSchema.priority)
      .having(gt(count(), 0))
      .execute();
  } catch {
    return [];
  }
}
