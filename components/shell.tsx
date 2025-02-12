import type * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const shellVariants = cva('grid items-center gap-8 pt-6', {
  variants: {
    variant: {
      default: 'container',
      sidebar: '',
      centered: 'container',
      markdown: 'container'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

interface ShellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof shellVariants> {
  as?: React.ElementType;
}

function Shell({ className, as: Comp = 'section', variant, ...props }: ShellProps) {
  return <Comp className={cn(shellVariants({ variant }), className)} {...props} />;
}

export { Shell, shellVariants };
