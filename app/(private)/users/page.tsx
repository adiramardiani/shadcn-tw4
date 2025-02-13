import { MailPlus, User2, WindArrowDown } from 'lucide-react';

import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { DataTable } from './components/data-table';
import { columns } from './components/data-table/columns';
import { CreateModal } from './components/modal/create';
import { getCollection } from './data/fake';
import { identity } from './identity';

export const metadata: Metadata = {
  title: identity.index.title,
  description: identity.index.description
};

export default async function Page() {
  const collection = await getCollection();

  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex flex-wrap items-center justify-between space-y-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-teal-100 p-2 dark:bg-teal-900/30">
            <User2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{identity.index.title}</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">{identity.index.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            Invite
            <MailPlus />
          </Button>
          <Button variant="outline" asChild>
            <Link href={`${identity.basePath}/api-doc`}>
              Api Doc
              <WindArrowDown />
            </Link>
          </Button>
          <CreateModal />
        </div>
      </div>
      <DataTable data={collection} columns={columns} />
    </div>
  );
}
