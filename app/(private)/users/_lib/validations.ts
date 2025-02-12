import {
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum
} from 'nuqs/server';
import * as z from 'zod';

import { getFiltersStateParser, getSortingStateParser } from '@/lib/parsers';

import type { Model } from '../model/schema';
import { modelSchema } from '../model/schema';

export const searchParams = {
  flags: parseAsArrayOf(z.enum(['advancedTable', 'floatingBar'])).withDefault([]),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Model>().withDefault([{ id: 'createdAt', desc: true }]),
  title: parseAsString.withDefault(''),
  status: parseAsArrayOf(z.enum(modelSchema.status.enumValues)).withDefault([]),
  priority: parseAsArrayOf(z.enum(modelSchema.priority.enumValues)).withDefault([]),
  from: parseAsString.withDefault(''),
  to: parseAsString.withDefault(''),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and')
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);

export const createSchema = z.object({
  title: z.string(),
  label: z.enum(modelSchema.label.enumValues),
  status: z.enum(modelSchema.status.enumValues),
  priority: z.enum(modelSchema.priority.enumValues)
});

export const updateSchema = z.object({
  title: z.string().optional(),
  label: z.enum(modelSchema.label.enumValues).optional(),
  status: z.enum(modelSchema.status.enumValues).optional(),
  priority: z.enum(modelSchema.priority.enumValues).optional()
});

export type GetModelSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>;
export type CreateSchema = z.infer<typeof createSchema>;
export type UpdateSchema = z.infer<typeof updateSchema>;
