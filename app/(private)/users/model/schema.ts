import { z } from 'zod';

export const modelStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended')
]);

// export const modelRoleSchema = z.enum(['superadmin', 'admin', 'cashier', 'manager']);
export const modelRoleSchema = z.union([
  z.literal('superadmin'),
  z.literal('admin'),
  z.literal('cashier'),
  z.literal('manager')
]);

export const modelSchema = z.object({
  id: z.string().nullable(),
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  email: z.string(),
  phone_number: z.string(),
  status: modelStatusSchema,
  role: modelRoleSchema,
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable()
});

export type Model = z.infer<typeof modelSchema>;
export type ModelStatus = z.infer<typeof modelStatusSchema>;
export type ModelRole = z.infer<typeof modelRoleSchema>;
