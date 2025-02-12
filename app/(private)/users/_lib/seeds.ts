import type { Model } from '../model/schema';
import { modelSchema } from '../model/schema';
import { generateRandomData } from './utils';

import { db } from '@/db/index';

export async function seedData(input: { count: number }) {
  const count = input.count ?? 100;

  try {
    const allItems: Model[] = [];

    for (let i = 0; i < count; i++) {
      allItems.push(generateRandomData());
    }

    await db.delete(modelSchema);

    console.log('📝 Inserting items', allItems.length);

    await db.insert(modelSchema).values(allItems).onConflictDoNothing();
  } catch (err) {
    console.error(err);
  }
}
