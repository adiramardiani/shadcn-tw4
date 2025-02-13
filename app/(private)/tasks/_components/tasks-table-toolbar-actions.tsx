'use client';

import { Download } from 'lucide-react';

import type { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';

import { exportTableToCSV } from '@/lib/export';

import type { Model } from '../model/schema';
import { CreateSheet } from './create-task-sheet';
import { DeleteDialog } from './delete-tasks-dialog';

interface PageTableToolbarActionsProps {
  table: Table<Model>;
}

export function PageTableToolbarActions({ table }: PageTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteDialog
          items={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateSheet />
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'tasks',
            excludeColumns: ['select', 'actions']
          })
        }
        className="gap-2"
      >
        <Download className="size-4" aria-hidden="true" />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
