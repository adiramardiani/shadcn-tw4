'use client';

import * as React from 'react';

import { useQueryState } from 'nuqs';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import type { DataTableConfig } from '@/config/data-table';
import { dataTableConfig } from '@/config/data-table';

type FeatureFlagValue = DataTableConfig['featureFlags'][number]['value'];

interface PageTableContextProps {
  featureFlags: FeatureFlagValue[];
  setFeatureFlags: (value: FeatureFlagValue[]) => void;
}

const PageTableContext = React.createContext<PageTableContextProps>({
  featureFlags: [],
  setFeatureFlags: () => {}
});

export function usePageTable() {
  const context = React.useContext(PageTableContext);
  if (!context) {
    throw new Error('usePageTable must be used within a PageTableProvider');
  }
  return context;
}

export function PageTableProvider({ children }: React.PropsWithChildren) {
  const [featureFlags, setFeatureFlags] = useQueryState<FeatureFlagValue[]>('featureFlags', {
    defaultValue: [],
    parse: (value) => value.split(',') as FeatureFlagValue[],
    serialize: (value) => value.join(','),
    eq: (a, b) => a.length === b.length && a.every((value, index) => value === b[index]),
    clearOnDefault: true
  });

  return (
    <PageTableContext.Provider
      value={{
        featureFlags,
        setFeatureFlags: (value) => void setFeatureFlags(value)
      }}
    >
      <div className="w-full overflow-x-auto">
        <ToggleGroup
          type="multiple"
          variant="outline"
          size="sm"
          value={featureFlags}
          onValueChange={(value: FeatureFlagValue[]) => setFeatureFlags(value)}
          className="w-fit"
        >
          {dataTableConfig.featureFlags.map((flag) => (
            <Tooltip key={flag.value}>
              <ToggleGroupItem
                value={flag.value}
                className="px-3 text-xs whitespace-nowrap"
                asChild
              >
                <TooltipTrigger>
                  <flag.icon className="mr-2 size-3.5 shrink-0" aria-hidden="true" />
                  {flag.label}
                </TooltipTrigger>
              </ToggleGroupItem>
              <TooltipContent align="start" side="bottom" sideOffset={6}>
                <div>{flag.tooltipTitle}</div>
                <div className="text-muted-foreground text-xs">{flag.tooltipDescription}</div>
              </TooltipContent>
            </Tooltip>
          ))}
        </ToggleGroup>
      </div>
      {children}
    </PageTableContext.Provider>
  );
}
