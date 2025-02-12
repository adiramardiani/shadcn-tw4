import 'server-only';

import { and, asc, count, desc, gt, gte, ilike, inArray, lte } from 'drizzle-orm';

import { filterColumns } from '@/lib/filter-columns';
import { unstable_cache } from '@/lib/unstable-cache';

import type { Model } from '../model/schema';
import { modelSchema } from '../model/schema';
import { model_count_priority, model_count_status, model_tag } from './constants';
import type { GetModelSchema } from './validations';

import { db } from '@/db';

export async function getModelCollection(input: GetModelSchema) {
  return await unstable_cache(
    async () => {
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
    },
    [JSON.stringify(input)],
    {
      revalidate: 3600,
      tags: [model_tag]
    }
  )();
}

export async function getModelStatusCounts() {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            status: modelSchema.status,
            count: count()
          })
          .from(modelSchema)
          .groupBy(modelSchema.status)
          .having(gt(count(), 0))
          .then((res) =>
            res.reduce(
              (acc, { status, count }) => {
                acc[status] = count;
                return acc;
              },
              {} as Record<Model['status'], number>
            )
          );
      } catch {
        return {} as Record<Model['status'], number>;
      }
    },
    [model_count_status],
    {
      revalidate: 3600
    }
  )();
}

export async function getModelPriorityCounts() {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            priority: modelSchema.priority,
            count: count()
          })
          .from(modelSchema)
          .groupBy(modelSchema.priority)
          .having(gt(count(), 0))
          .then((res) =>
            res.reduce(
              (acc, { priority, count }) => {
                acc[priority] = count;
                return acc;
              },
              {} as Record<Model['priority'], number>
            )
          );
      } catch {
        return {} as Record<Model['priority'], number>;
      }
    },
    [model_count_priority],
    {
      revalidate: 3600
    }
  )();
}
