import { ChevronLeft, Save, X } from 'lucide-react';

import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { generateData } from '../../data/fake';
import { identity } from '../../identity';
import type { Model } from '../../model/schema';
import Content from './components/content';

export const metadata: Metadata = {
  title: identity.update.title,
  description: identity.update.description
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
    return <div>Data not found</div>;
  }

  return (
    <div className="flex h-full flex-col p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{identity.update.title}</h2>
            <p className="text-muted-foreground text-sm">{identity.update.description}</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href={`${identity.basePath}`}>
              <ChevronLeft />
              Back
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          <Content model={model} />
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-between p-4">
          <Button variant="outline" asChild>
            <Link href={`${identity.basePath}/${model.id}`}>
              <X />
              Cancel
            </Link>
          </Button>
          <Button type="submit" form="page-form">
            <Save />
            Save
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
