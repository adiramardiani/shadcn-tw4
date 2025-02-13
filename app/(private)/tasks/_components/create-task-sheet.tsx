'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';

import { Loader, Plus } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

import { useMediaQuery } from '@/hooks/use-media-query';

import { createData } from '../_lib/actions';
import type { CreateSchema } from '../_lib/validations';
import { createSchema } from '../_lib/validations';
import { PageForm } from './task-form';

export function CreateSheet() {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  const form = useForm<CreateSchema>({
    resolver: zodResolver(createSchema)
  });

  function onSubmit(input: CreateSchema) {
    startTransition(async () => {
      const { error } = await createData(input);

      if (error) {
        toast.error(error);
        return;
      }

      form.reset();
      setOpen(false);
      toast.success('Data created');
    });
  }

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="size-4" aria-hidden="true" />
            New
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Create data</DialogTitle>
            <DialogDescription>Fill in the details below to create a new data</DialogDescription>
          </DialogHeader>
          <PageForm<CreateSchema> form={form} onSubmit={onSubmit}>
            <DialogFooter className="gap-2 pt-2 sm:space-x-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isPending}>
                {isPending && <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                Create
              </Button>
            </DialogFooter>
          </PageForm>
        </DialogContent>
      </Dialog>
    );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          New
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-2 p-4 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Create data</SheetTitle>
          <SheetDescription>Fill in the details below to create a new data</SheetDescription>
        </SheetHeader>
        <PageForm<CreateSchema> form={form} onSubmit={onSubmit}>
          <SheetFooter className="gap-2 p-0 pt-2 sm:space-x-0">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button disabled={isPending}>
              {isPending && <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              Create
            </Button>
          </SheetFooter>
        </PageForm>
      </SheetContent>
    </Sheet>
  );
}
