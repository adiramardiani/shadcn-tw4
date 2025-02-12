'use client';

import * as React from 'react';

import { Ellipsis } from 'lucide-react';

import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

import { getErrorMessage } from '@/lib/handle-error';
import { formatDate } from '@/lib/utils';

import { updateData } from '../_lib/actions';
import { getPriorityIcon, getStatusIcon } from '../_lib/utils';
import type { Model } from '../model/schema';
import { modelSchema } from '../model/schema';

import type { DataTableRowAction } from '@/types/data-table';

interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Model> | null>>;
}

export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<Model>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="mx-auto flex w-4 items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="translate-y-0.5"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="mx-auto flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-0.5"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      id: 'id',
      header: () => <div className="mx-auto flex w-4 items-center justify-center">#</div>,
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        const rowNumber = pageIndex * pageSize + row.index + 1;
        // const rowNumber =
        //   (table.getSortedRowModel()?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) +
        //   1;
        return <div className="mx-auto flex items-center justify-center">{rowNumber}</div>;
      },
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'code',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Task" />,
      cell: ({ row }) => <div className="w-20">{row.getValue('code')}</div>,
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => {
        const label = modelSchema.label.enumValues.find((label) => label === row.original.label);

        return (
          <div className="flex space-x-2">
            {label && <Badge variant="outline">{label}</Badge>}
            <span className="max-w-[31.25rem] truncate font-medium">{row.getValue('title')}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = modelSchema.status.enumValues.find(
          (status) => status === row.original.status
        );

        if (!status) return null;

        const Icon = getStatusIcon(status);

        return (
          <div className="flex w-[6.25rem] items-center">
            <Icon className="text-muted-foreground mr-2 size-4" aria-hidden="true" />
            <span className="capitalize">{status}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      }
    },
    {
      accessorKey: 'priority',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
      cell: ({ row }) => {
        const priority = modelSchema.priority.enumValues.find(
          (priority) => priority === row.original.priority
        );

        if (!priority) return null;

        const Icon = getPriorityIcon(priority);

        return (
          <div className="flex items-center">
            <Icon className="text-muted-foreground mr-2 size-4" aria-hidden="true" />
            <span className="capitalize">{priority}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id));
      }
    },
    {
      accessorKey: 'archived',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Archived" />,
      cell: ({ row }) => <Badge variant="outline">{row.original.archived ? 'Yes' : 'No'}</Badge>
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => (
        <div className="whitespace-nowrap">{formatDate(row.original.createdAt)}</div>
      )
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition();

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="data-[state=open]:bg-muted flex size-8 p-0"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onSelect={() => setRowAction({ row, type: 'update' })}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.label}
                    onValueChange={(value) => {
                      startUpdateTransition(() => {
                        toast.promise(
                          updateData({
                            id: row.original.id,
                            label: value as Model['label']
                          }),
                          {
                            loading: 'Updating...',
                            success: 'Label updated',
                            error: (err) => getErrorMessage(err)
                          }
                        );
                      });
                    }}
                  >
                    {modelSchema.label.enumValues.map((label) => (
                      <DropdownMenuRadioItem
                        key={label}
                        value={label}
                        className="capitalize"
                        disabled={isUpdatePending}
                      >
                        {label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setRowAction({ row, type: 'delete' })}>
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40
    }
  ];
}
