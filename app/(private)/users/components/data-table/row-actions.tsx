'use client';

import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import type { Model } from '../../model/schema';
import { DeleteDialog } from '../modal/delete';
import { DetailModal } from '../modal/detail';
import { UpdateModal } from '../modal/update';

export function RowActions({ row }: { row: { original: Model } }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted mx-auto flex h-8 w-8 items-center justify-center p-0"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DetailModal model={row.original} />
        <UpdateModal model={row.original} />
        <DropdownMenuSeparator />
        <DeleteDialog model={row.original} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
