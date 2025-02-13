'use client';

import { Download, Upload, X } from 'lucide-react';

import type { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { roles, statuses } from '../../data';
import { FacetedFilter } from '../ui/data-table/faceted-filter';

interface ToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: ToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Filter data ..."
          value={(table.getColumn('username')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('username')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('status') && (
          <FacetedFilter column={table.getColumn('status')} title="Status" options={statuses} />
        )}
        {table.getColumn('role') && (
          <FacetedFilter column={table.getColumn('role')} title="Role" options={roles} />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
        <Button variant="outline">
          Import
          <Download />
        </Button>
        <Button variant="outline">
          Export
          <Upload />
        </Button>
      </div>
    </div>
  );
}
