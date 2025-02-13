import { cookies } from 'next/headers';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';

import { cn } from '@/lib/utils';

export default async function PrivateLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      className="flex flex-col pt-(--header-height) [--header-height:calc(--spacing(14))]"
    >
      <SiteHeader />
      <div className="flex flex-1">
        <AppSidebar />
        <SidebarInset
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] duration-200 ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
          )}
        >
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
