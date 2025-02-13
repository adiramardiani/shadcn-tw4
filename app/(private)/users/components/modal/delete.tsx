'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { DropdownMenuItem, DropdownMenuShortcut } from '@/components/ui/dropdown-menu';

import { identity } from '../../identity';
import type { Model } from '../../model/schema';

export function DeleteDialog({ model }: { model: Model }) {
  const [open, setOpen] = useState(false);

  const handleAction = async () => {
    console.log('Deleting data:', model);
    setOpen(false);
    toast.success(identity.delete.success);
    // After successful deletion, you might want to refresh the data
    // router.refresh();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{identity.delete.title}</AlertDialogTitle>
          <AlertDialogDescription>{identity.delete.description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAction} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
