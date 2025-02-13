import {
  CheckCircle,
  Circle,
  CircleOff,
  Shield,
  Timer,
  UserCog,
  UserPen,
  Users
} from 'lucide-react';

import type { ModelRole, ModelStatus } from '../model/schema';

export const statuses: {
  value: ModelStatus;
  label: string;
  labelClassName: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: 'active',
    label: 'Active',
    labelClassName:
      ' bg-teal-500/15 text-teal-700 group-data-[hover]:bg-teal-500/25 dark:bg-teal-500/10 dark:text-teal-300 dark:group-data-[hover]:bg-teal-500/20',
    icon: CheckCircle
  },
  {
    value: 'inactive',
    label: 'Inactive',
    labelClassName:
      ' bg-zinc-600/10 text-zinc-700 group-data-[hover]:bg-zinc-600/20 dark:bg-white/5 dark:text-zinc-400 dark:group-data-[hover]:bg-white/10',
    icon: Circle
  },
  {
    value: 'invited',
    label: 'Invited',
    labelClassName:
      ' bg-sky-500/15 text-sky-700 group-data-[hover]:bg-sky-500/25 dark:bg-sky-500/10 dark:text-sky-300 dark:group-data-[hover]:bg-sky-500/20',
    icon: Timer
  },
  {
    value: 'suspended',
    label: 'Suspended',
    labelClassName:
      ' bg-red-500/15 text-red-700 group-data-[hover]:bg-red-500/25 dark:bg-red-500/10 dark:text-red-400 dark:group-data-[hover]:bg-red-500/20',
    icon: CircleOff
  }
];

export const roles: {
  value: ModelRole;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: 'superadmin',
    label: 'Superadmin',
    icon: Shield
  },
  {
    value: 'admin',
    label: 'Admin',
    icon: UserCog
  },
  {
    value: 'manager',
    label: 'Manager',
    icon: Users
  },
  {
    value: 'cashier',
    label: 'Cashier',
    icon: UserPen
  }
];
