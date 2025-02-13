'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { cn } from '@/lib/utils';

import { roles, statuses } from '../../data';
import type { Model } from '../../model/schema';
import { ColumnHeader } from '../ui/data-table/column-header';
import { ViewOptions } from '../ui/data-table/view-options';
import { RowActions } from './row-actions';

export const columns: ColumnDef<Model>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'number',
    header: () => <div className="mx-auto flex w-4 items-center justify-center">#</div>,
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return (
        <div className="mx-auto flex items-center justify-center">
          {pageIndex * pageSize + row.index + 1}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'username',
    header: ({ column }) => <ColumnHeader column={column} title="Username" />,
    cell: ({ row }) => <div className="max-w-36 truncate">{row.getValue('username')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'full_name',
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const { first_name, last_name } = row.original;
      const fullName = `${first_name} ${last_name}`;

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{fullName}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <ColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div className="w-fit text-nowrap">{row.getValue('email')}</div>
  },
  {
    accessorKey: 'phone_number',
    header: ({ column }) => <ColumnHeader column={column} title="Phone Number" />,
    cell: ({ row }) => <div>{row.getValue('phone_number')}</div>
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <ColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = statuses.find((status) => status.value === row.getValue('status'));

      if (!status) {
        return null;
      }

      return (
        <div className="flex items-center">
          <Badge variant="outline" className={cn('gap-2 capitalize', status.labelClassName)}>
            {status.icon && <status.icon className={cn('h-3 w-3')} />}
            <span>{status.label}</span>
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'role',
    header: ({ column }) => <ColumnHeader column={column} title="Role" />,
    cell: ({ row }) => {
      const role = roles.find((role) => role.value === row.getValue('role'));

      if (!role) {
        return null;
      }

      return (
        <div className="flex items-center gap-2">
          {role.icon && <role.icon className="text-muted-foreground h-4 w-4" />}
          <span>{role.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <ColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => format(new Date(row.getValue('created_at')), 'PPP'),
    filterFn: (row, id, value) => {
      const date = new Date(row.getValue(id));
      return date >= value.from && date <= value.to;
    }
  },
  // {
  //   accessorKey: 'updated_at',
  //   header: ({ column }) => <ColumnHeader column={column} title="Updated At" />,
  //   cell: ({ row }) => format(new Date(row.getValue('updated_at')), 'PPP'),
  //   filterFn: (row, id, value) => {
  //     const date = new Date(row.getValue(id));
  //     return date >= value.from && date <= value.to;
  //   }
  // },
  {
    id: 'actions',
    header: ({ table }) => <ViewOptions table={table} />,
    cell: ({ row }) => <RowActions row={row} />
  }
];
