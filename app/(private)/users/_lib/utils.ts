import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircle2,
  CircleHelp,
  CircleIcon,
  CircleX,
  Timer
} from 'lucide-react';

import { faker } from '@faker-js/faker';
import { customAlphabet } from 'nanoid';

import { generateId } from '@/lib/id';

import type { Model } from '../model/schema';
import { modelSchema } from '../model/schema';

export function generateRandomData(): Model {
  return {
    id: generateId('task'),
    code: `TASK-${customAlphabet('0123456789', 4)()}`,
    title: faker.hacker.phrase().replace(/^./, (letter) => letter.toUpperCase()),
    status: faker.helpers.shuffle(modelSchema.status.enumValues)[0] ?? 'todo',
    label: faker.helpers.shuffle(modelSchema.label.enumValues)[0] ?? 'bug',
    priority: faker.helpers.shuffle(modelSchema.priority.enumValues)[0] ?? 'low',
    archived: faker.datatype.boolean({ probability: 0.2 }),
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

/**
 * Returns the appropriate status icon based on the provided status.
 * @param status - The status of the data.
 * @returns A React component representing the status icon.
 */
export function getStatusIcon(status: Model['status']) {
  const statusIcons = {
    canceled: CircleX,
    done: CheckCircle2,
    'in-progress': Timer,
    todo: CircleHelp
  };

  return statusIcons[status] || CircleIcon;
}

/**
 * Returns the appropriate priority icon based on the provided priority.
 * @param priority - The priority of the data.
 * @returns A React component representing the priority icon.
 */
export function getPriorityIcon(priority: Model['priority']) {
  const priorityIcons = {
    high: ArrowUpIcon,
    low: ArrowDownIcon,
    medium: ArrowRightIcon
  };

  return priorityIcons[priority] || CircleIcon;
}
