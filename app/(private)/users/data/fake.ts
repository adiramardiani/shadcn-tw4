import { faker } from '@faker-js/faker';
import { z } from 'zod';

import type { Model } from '../model/schema';
import { modelSchema } from '../model/schema';

export function generateData(): Model {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    id: faker.string.uuid(),
    first_name: firstName,
    last_name: lastName,
    username: faker.internet.username({ firstName, lastName }).toLocaleLowerCase(),
    email: faker.internet.email({ firstName }).toLocaleLowerCase(),
    phone_number: faker.phone.number({ style: 'international' }),
    status: faker.helpers.arrayElement(['active', 'inactive', 'invited', 'suspended']),
    role: faker.helpers.arrayElement(['superadmin', 'admin', 'cashier', 'manager']),
    created_at: faker.date.past(),
    updated_at: faker.date.recent()
  };
}

export async function getCollection(count: number = 100) {
  const collection = Array.from({ length: count }, generateData);
  return z.array(modelSchema).parse(collection);
}
