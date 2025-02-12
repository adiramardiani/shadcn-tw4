import { tasks } from '@/db/schema';

export type Model = typeof tasks.$inferSelect;

export const modelSchema = tasks;
