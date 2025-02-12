import * as React from 'react';

import type { SearchParams } from 'nuqs/server';

import { Skeleton } from '@/components/ui/skeleton';

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { DateRangePicker } from '@/components/date-range-picker';

import { getValidFilters } from '@/lib/data-table';

import { FeatureFlagsProvider } from './_components/feature-flags-provider';
import { TasksTable } from './_components/tasks-table';
import { getTaskPriorityCounts, getTasks, getTaskStatusCounts } from './_lib/queries';
import { searchParamsCache, serialize } from './_lib/validations';

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function IndexPage(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const key = serialize({ ...search });

  const validFilters = getValidFilters(search.filters);

  const promises = Promise.all([
    getTasks({
      ...search,
      filters: validFilters
    }),
    getTaskStatusCounts(),
    getTaskPriorityCounts()
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <FeatureFlagsProvider>
        <React.Suspense key={`filter-${key}`} fallback={<Skeleton className="h-7 w-52" />}>
          <DateRangePicker
            triggerSize="sm"
            triggerClassName="ml-auto w-56 sm:w-60"
            align="end"
            shallow={false}
          />
        </React.Suspense>
        <React.Suspense
          key={`table-${key}`}
          fallback={
            <DataTableSkeleton
              columnCount={6}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem', '8rem']}
              shrinkZero
            />
          }
        >
          <TasksTable promises={promises} />
        </React.Suspense>
      </FeatureFlagsProvider>
    </div>
  );
}
