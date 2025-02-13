import { ChevronLeft, Pencil } from 'lucide-react';

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { PageDetail } from '../components/partial/detail';
import { generateData } from '../data/fake';
import { identity } from '../identity';
import type { Model } from '../model/schema';

export const metadata: Metadata = {
  title: identity.detail.title,
  description: identity.detail.description
};

async function getData(id: string): Promise<Model | undefined> {
  const mockData = generateData();
  return {
    ...mockData,
    id
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const model = await getData(id);

  if (!model) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{identity.detail.title}</h2>
            <p className="text-muted-foreground text-sm">{identity.detail.description}</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href={`${identity.basePath}`}>
              <ChevronLeft />
              Back
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          <PageDetail model={model} />
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-end gap-2 p-4">
          <Button asChild>
            <Link href={`${identity.basePath}/${model.id}/edit`}>
              <Pencil />
              Edit
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
