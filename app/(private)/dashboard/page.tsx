import { Home } from 'lucide-react';

import List01 from './components/list-01';
import List021 from './components/list-02-1';
import List022 from './components/list-02-2';
import List031 from './components/list-03-1';
import List032 from './components/list-03-2';

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-sky-100 p-2 dark:bg-sky-900/30">
          <Home className="h-5 w-5 text-sky-600 dark:text-sky-400" />
        </div>
        <div>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Dashboard</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            All dummy widget and statistic.
          </p>
        </div>
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <List01 />
        <List021 />
        <List022 />
      </div>
      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold">Financial Goals</h2>
        <List031 />
      </div>
      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold">Financial Realization</h2>
        <List032 />
      </div>
    </div>
  );
}
