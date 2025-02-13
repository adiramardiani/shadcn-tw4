'use client';

import { useState } from 'react';

import { ExternalLink, Save, X } from 'lucide-react';

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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

import { identity } from '../../identity';
import type { Model } from '../../model/schema';
import { PageForm } from '../partial/form';

export function UpdateModal({ model }: { model: Model }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: Model) => {
    console.log('Updated data:', data);
    setOpen(false);
    toast.success(identity.update.success);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="border-b p-4">
          <DialogTitle className="text-xl font-semibold">{identity.update.title}</DialogTitle>
        </DialogHeader>
        <div className="px-4">
          <PageForm initialData={model} onSubmit={handleSubmit} />
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
                  router.push(`${identity.basePath}/${model.id}/edit`);
                }}
              >
                <ExternalLink />
                Open as Page
              </Button>
              <Button type="submit" form="page-form">
                <Save />
                Save
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
