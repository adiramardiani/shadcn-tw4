import { supabase } from '@/lib/supabase';

export type SortOrder = 'asc' | 'desc';

export interface QueryParams<T extends Record<string, unknown>> {
  page?: number;
  per_page?: number;
  sort?: { column: keyof T; order: SortOrder };
  filter?: Partial<T>;
}

export async function fetchData<T extends Record<string, unknown>>(
  tableName: string,
  query: QueryParams<T>
): Promise<{ data: T[]; totalCount: number }> {
  const { page = 1, per_page = 10, sort, filter } = query;
  let queryBuilder = supabase.from(tableName).select('*', { count: 'exact' });

  // Apply filters
  if (filter && typeof filter === 'object') {
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryBuilder = queryBuilder.ilike(key, `%${value}%`);
      }
    });
  }

  // Apply sorting
  if (sort) {
    queryBuilder = queryBuilder.order(sort.column as string, { ascending: sort.order === 'asc' });
  }

  // Apply pagination
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;
  queryBuilder = queryBuilder.range(from, to);

  const { data, error, count } = await queryBuilder;

  if (error) {
    throw new Error(error.message);
  }

  return { data: data as T[], totalCount: count ?? 0 };
}

export async function fetchSingleData<T extends Record<string, unknown>>(
  tableName: string,
  id: string
): Promise<T> {
  const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single();

  if (error) {
    throw new Error(error.message);
  }

  return data as T;
}

export async function createData<T extends Record<string, unknown>>(
  tableName: string,
  data: Omit<T, 'id'>
): Promise<T> {
  const { data: createdData, error } = await supabase
    .from(tableName)
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return createdData as T;
}

export async function updateData<T extends Record<string, unknown>>(
  tableName: string,
  id: string,
  data: Partial<Omit<T, 'id'>>
): Promise<T> {
  const { data: updatedData, error } = await supabase
    .from(tableName)
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return updatedData as T;
}

export async function deleteData(tableName: string, id: string): Promise<void> {
  const { error } = await supabase.from(tableName).delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}
