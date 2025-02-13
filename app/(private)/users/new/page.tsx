import { ChevronLeft, Plus, X } from 'lucide-react';

import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { identity } from '../identity';
import Content from './components/content';

export const metadata: Metadata = {
  title: identity.create.title,
  description: identity.create.description
};

export default function Page() {
  return (
    <div className="flex h-full flex-col p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{identity.create.title}</h2>
            <p className="text-muted-foreground text-sm">{identity.create.description}</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href={`${identity.basePath}`}>
              <ChevronLeft />
              Back
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          <Content />
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-between p-4">
          <Button variant="outline" asChild>
            <Link href={`${identity.basePath}`}>
              <X />
              Cancel
            </Link>
          </Button>
          <Button type="submit" form="page-form">
            <Plus />
            Create
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
