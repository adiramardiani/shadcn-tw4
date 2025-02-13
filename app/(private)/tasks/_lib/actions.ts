'use server';

import { asc, eq, inArray, not } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';
import { revalidateTag } from 'next/cache';

import { getErrorMessage } from '@/lib/handle-error';

import type { Model } from '../model/schema';
import { modelSchema } from '../model/schema';
import {
  cache_tag_collection,
  cache_tag_count_priority,
  cache_tag_count_status
} from './constants';
import { generateRandomData } from './utils';
import type { CreateSchema, UpdateSchema } from './validations';

import { db } from '@/db/index';
import { takeFirstOrThrow } from '@/db/utils';

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

export async function createData(input: CreateSchema) {
  try {
    await db.transaction(async (tx) => {
      const data = await tx
        .insert(modelSchema)
        .values({
          code: `TASK-${customAlphabet('0123456789', 4)()}`,
          title: input.title,
          status: input.status,
          label: input.label,
          priority: input.priority
        })
        .returning({
          id: modelSchema.id
        })
        .then(takeFirstOrThrow);

      // Delete a data to keep the total number of data constant
      await tx.delete(modelSchema).where(
        eq(
          modelSchema.id,
          (
            await tx
              .select({
                id: modelSchema.id
              })
              .from(modelSchema)
              .limit(1)
              .where(not(eq(modelSchema.id, data.id)))
              .orderBy(asc(modelSchema.createdAt))
              .then(takeFirstOrThrow)
          ).id
        )
      );
    });

    revalidateTag(cache_tag_collection);
    revalidateTag(cache_tag_count_status);
    revalidateTag(cache_tag_count_priority);

    return {
      data: null,
      error: null
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err)
    };
  }
}

export async function updateData(input: UpdateSchema & { id: string }) {
  try {
    const data = await db
      .update(modelSchema)
      .set({
        title: input.title,
        label: input.label,
        status: input.status,
        priority: input.priority
      })
      .where(eq(modelSchema.id, input.id))
      .returning({
        status: modelSchema.status,
        priority: modelSchema.priority
      })
      .then(takeFirstOrThrow);

    revalidateTag(cache_tag_collection);
    if (data.status === input.status) {
      revalidateTag(cache_tag_count_status);
    }
    if (data.priority === input.priority) {
      revalidateTag(cache_tag_count_priority);
    }

    return {
      data: null,
      error: null
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err)
    };
  }
}

export async function updateMultipleData(input: {
  ids: string[];
  label?: Model['label'];
  status?: Model['status'];
  priority?: Model['priority'];
}) {
  try {
    const data = await db
      .update(modelSchema)
      .set({
        label: input.label,
        status: input.status,
        priority: input.priority
      })
      .where(inArray(modelSchema.id, input.ids))
      .returning({
        status: modelSchema.status,
        priority: modelSchema.priority
      })
      .then(takeFirstOrThrow);

    revalidateTag(cache_tag_collection);
    if (data.status === input.status) {
      revalidateTag(cache_tag_count_status);
    }
    if (data.priority === input.priority) {
      revalidateTag(cache_tag_count_priority);
    }

    return {
      data: null,
      error: null
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err)
    };
  }
}

export async function deleteData(input: { id: string }) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(modelSchema).where(eq(modelSchema.id, input.id));

      // Create a new data for the deleted one
      await tx.insert(modelSchema).values(generateRandomData());
    });

    revalidateTag(cache_tag_collection);
    revalidateTag(cache_tag_count_status);
    revalidateTag(cache_tag_count_priority);

    return {
      data: null,
      error: null
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err)
    };
  }
}

export async function deleteMultipleData(input: { ids: string[] }) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(modelSchema).where(inArray(modelSchema.id, input.ids));

      // Create new items for the deleted ones
      await tx.insert(modelSchema).values(input.ids.map(() => generateRandomData()));
    });

    revalidateTag(cache_tag_collection);
    revalidateTag(cache_tag_count_status);
    revalidateTag(cache_tag_count_priority);

    return {
      data: null,
      error: null
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err)
    };
  }
}
