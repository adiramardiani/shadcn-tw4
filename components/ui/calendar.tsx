'use client';

import * as React from 'react';
import type { DayPickerProps } from 'react-day-picker';
import { DayPicker } from 'react-day-picker';

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';

import { cn } from '@/lib/utils';

export type CalendarProps = DayPickerProps;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  numberOfMonths,
  ...props
}: CalendarProps) {
  const [navView] = React.useState<'days' | 'years'>('days');

  const columnsDisplayed = navView === 'years' ? 1 : numberOfMonths;
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      numberOfMonths={columnsDisplayed}
      classNames={{
        months: 'relative flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'flex flex-col gap-4',
        month_caption: 'flex justify-center pt-1 relative items-center w-full',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center gap-1 absolute h-7 w-full z-10',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          'absolute left-1'
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          'absolute right-1'
        ),
        month_grid: 'w-full border-collapse space-x-1',
        weekdays: 'flex',
        weekday: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        week: 'flex w-full mt-2',
        day: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 font-normal aria-selected:opacity-100'
        ),
        range_start: 'day-range-start',
        range_end: 'day-range-end',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today: 'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground',
        outside:
          ' text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-50',
        range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        hidden: 'invisible',
        ...classNames
      }}
      components={{
        DayButton({ modifiers, className, ...buttonProps }) {
          return (
            <Button
              variant={'ghost'}
              className={cn(
                className,
                'h-9 w-9 p-0 font-normal',
                modifiers?.today && 'bg-accent text-accent-foreground',
                modifiers?.selected &&
                  'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                modifiers?.outside && 'text-muted-foreground pointer-events-none opacity-50',
                modifiers?.disabled && 'text-muted-foreground opacity-50',
                modifiers?.hidden && 'invisible',
                modifiers.range_start && 'rounded-e-none',
                modifiers.range_end && 'rounded-s-none',
                modifiers.range_middle &&
                  'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground rounded-none first:rounded-s-md last:rounded-e-md',
                modifiers.outside && modifiers.selected && 'bg-accent/40 text-muted-foreground'
              )}
              {...buttonProps}
              aria-selected={modifiers.selected || buttonProps['aria-selected']}
              aria-disabled={modifiers.disabled || buttonProps['aria-disabled']}
              aria-hidden={modifiers.hidden || buttonProps['aria-hidden']}
            />
          );
        },
        Chevron: (props) => {
          const Component =
            props.orientation === 'left'
              ? ChevronLeftIcon
              : props.orientation === 'right'
                ? ChevronRightIcon
                : props.orientation === 'up'
                  ? ChevronUpIcon
                  : ChevronDownIcon;

          return (
            <Component
              className={cn('h-4 w-4', props.className)}
              aria-disabled={props.disabled}
              {...props}
            />
          );
        }
      }}
      {...props}
    />
  );
}

export { Calendar };
