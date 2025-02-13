'use server';

import type { Model } from '../model/schema';
import { modelSchema } from '../model/schema';

// You can extend the base schema if needed
const loginSchema = modelSchema.extend({
  // Add additional fields for login if necessary
});

export async function login(formData: Model) {
  const result = loginSchema.safeParse(formData);

  if (!result.success) {
    return { success: false, error: 'Invalid input' };
  }

  // Simulate API call with 1 second delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate successful login (you would typically check credentials here)
  if (result.data.email === 'admin@email.com' && result.data.password === 'password') {
    return { success: true };
  } else {
    return { success: false, error: 'Invalid email or password' };
  }
}
