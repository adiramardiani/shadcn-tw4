'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';

import { Loader } from 'lucide-react';

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
  DialogTitle
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

import { useMediaQuery } from '@/hooks/use-media-query';

import { updateData } from '../_lib/actions';
import { type UpdateSchema, updateSchema } from '../_lib/validations';
import type { Model } from '../model/schema';
import { PageForm } from './task-form';

interface UpdateSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  model: Model | null;
}

export function UpdateSheet({ model, ...props }: UpdateSheetProps) {
  const [isPending, startTransition] = React.useTransition();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  const form = useForm<UpdateSchema>({
    resolver: zodResolver(updateSchema),
    values: {
      title: model?.title ?? '',
      label: model?.label,
      status: model?.status,
      priority: model?.priority
    }
  });

  function onSubmit(input: UpdateSchema) {
    startTransition(async () => {
      if (!model) return;

      const { error } = await updateData({
        id: model.id,
        ...input
      });

      if (error) {
        toast.error(error);
        return;
      }

      form.reset();
      props.onOpenChange?.(false);
      toast.success('Data updated');
    });
  }

  if (isDesktop)
    return (
      <Dialog {...props}>
        <DialogContent className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Update data</DialogTitle>
            <DialogDescription>Update the data details and save the changes</DialogDescription>
          </DialogHeader>
          <PageForm<UpdateSchema> form={form} onSubmit={onSubmit}>
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
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-2 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update data</SheetTitle>
          <SheetDescription>Update the data details and save the changes</SheetDescription>
        </SheetHeader>
        <PageForm<UpdateSchema> form={form} onSubmit={onSubmit}>
          <SheetFooter className="gap-2 p-4 pt-2 sm:space-x-0">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button disabled={isPending}>
              {isPending && <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              Save
            </Button>
          </SheetFooter>
        </PageForm>
      </SheetContent>
    </Sheet>
  );
}
