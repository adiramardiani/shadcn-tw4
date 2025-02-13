'use client';

import { useState } from 'react';

import { ExternalLink, Pencil, X } from 'lucide-react';

import { useRouter } from 'next/navigation';

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
import { PageDetail } from '../partial/detail';

export function DetailModal({ model }: { model: Model }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>View</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="border-b p-4">
          <DialogTitle className="text-xl font-semibold">{identity.detail.title}</DialogTitle>
        </DialogHeader>
        <div className="px-4">
          <PageDetail model={model} />
        </div>
        <DialogFooter className="border-t p-4">
          <div className="flex w-full justify-between">
            <Button variant="outline" onClick={() => setOpen(false)}>
              <X />
              Close
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  router.push(`${identity.basePath}/${model.id}`);
                }}
              >
                <ExternalLink />
                Open as Page
              </Button>
              <Button
                onClick={() => {
                  setOpen(false);
                  router.push(`${identity.basePath}/${model.id}/edit`);
                }}
              >
                <Pencil />
                Edit
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
