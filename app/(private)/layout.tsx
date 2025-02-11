import { cookies } from 'next/headers';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';

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
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
