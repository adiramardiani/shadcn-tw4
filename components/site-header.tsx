import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

import { ModeSwitcher } from '@/components/mode-switcher';
import { NavHeader } from '@/components/nav-header';
import { SearchForm } from '@/components/search-form';

export function SiteHeader() {
  return (
    <header className="bg-background fixed inset-x-0 top-0 isolate z-10 flex shrink-0 items-center gap-2 border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1.5" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <NavHeader />
        <div className="ml-auto flex items-center gap-2">
          <ModeSwitcher />
          <SearchForm className="w-full sm:ml-auto sm:w-auto" />
        </div>
      </div>
    </header>
  );
}
