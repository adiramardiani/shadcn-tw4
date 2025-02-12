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

import { updateTask } from '../_lib/actions';
import { type UpdateTaskSchema, updateTaskSchema } from '../_lib/validations';
import { TaskForm } from './task-form';

import type { Task } from '@/db/schema';

interface UpdateTaskSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  task: Task | null;
}

export function UpdateTaskSheet({ task, ...props }: UpdateTaskSheetProps) {
  const [isPending, startTransition] = React.useTransition();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  const form = useForm<UpdateTaskSchema>({
    resolver: zodResolver(updateTaskSchema),
    values: {
      title: task?.title ?? '',
      label: task?.label,
      status: task?.status,
      priority: task?.priority
    }
  });

  function onSubmit(input: UpdateTaskSchema) {
    startTransition(async () => {
      if (!task) return;

      const { error } = await updateTask({
        id: task.id,
        ...input
      });

      if (error) {
        toast.error(error);
        return;
      }

      form.reset();
      props.onOpenChange?.(false);
      toast.success('Task updated');
    });
  }

  if (isDesktop)
    return (
      <Dialog {...props}>
        <DialogContent className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Update task</DialogTitle>
            <DialogDescription>Update the task details and save the changes</DialogDescription>
          </DialogHeader>
          <TaskForm<UpdateTaskSchema> form={form} onSubmit={onSubmit}>
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
          </TaskForm>
        </DialogContent>
      </Dialog>
    );

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-2 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update task</SheetTitle>
          <SheetDescription>Update the task details and save the changes</SheetDescription>
        </SheetHeader>
        <TaskForm<UpdateTaskSchema> form={form} onSubmit={onSubmit}>
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
        </TaskForm>
      </SheetContent>
    </Sheet>
  );
}
