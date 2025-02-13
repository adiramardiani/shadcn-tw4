'use client';

import { useState } from 'react';

import { ExternalLink, Plus, UserPlus, X } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import { identity } from '../../identity';
import type { Model } from '../../model/schema';
import { PageForm } from '../partial/form';

export function CreateModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: Model) => {
    console.log('New model data:', data);
    setOpen(false);
    toast.success(identity.create.success);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Create
          <UserPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="border-b p-4">
          <DialogTitle className="text-xl font-semibold">{identity.create.title}</DialogTitle>
        </DialogHeader>
        <div className="px-4">
          <PageForm onSubmit={handleSubmit} />
        </div>
        <DialogFooter className="border-t p-4">
          <div className="flex w-full justify-between">
            <Button variant="outline" onClick={() => setOpen(false)}>
              <X />
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  router.push(`${identity.basePath}/new`);
                }}
              >
                <ExternalLink />
                Open as Page
              </Button>
              <Button type="submit" form="page-form">
                <Plus />
                Create
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
