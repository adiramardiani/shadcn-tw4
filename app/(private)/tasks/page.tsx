import * as React from 'react';

import { ClipboardList } from 'lucide-react';

import type { SearchParams } from 'nuqs/server';

import { Skeleton } from '@/components/ui/skeleton';

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { DateRangePicker } from '@/components/date-range-picker';

import { getValidFilters } from '@/lib/data-table';

import { FeatureFlagsProvider } from './_components/feature-flags-provider';
import { PageTable } from './_components/tasks-table';
import { getModelCollection, getModelPriorityCounts, getModelStatusCounts } from './_lib/queries';
import { searchParamsCache } from './_lib/validations';

interface IndexPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function IndexPage(props: IndexPageProps) {
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const validFilters = getValidFilters(search.filters);

  const promises = Promise.all([
    getModelCollection({
      ...search,
      filters: validFilters
    }),
    getModelStatusCounts(),
    getModelPriorityCounts()
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
          <ClipboardList className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Tasks</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">Manage and track your tasks.</p>
        </div>
      </div>
      <FeatureFlagsProvider>
        <React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
          <DateRangePicker
            triggerSize="sm"
            triggerClassName="ml-auto w-56 sm:w-60"
            align="end"
            shallow={false}
          />
        </React.Suspense>
        <React.Suspense
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
          <PageTable promises={promises} />
        </React.Suspense>
      </FeatureFlagsProvider>
    </div>
  );
}
