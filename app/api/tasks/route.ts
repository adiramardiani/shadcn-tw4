import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getValidFilters } from '@/lib/data-table';

import { getModelCollection, getModelPriorityCounts, getModelStatusCounts } from './service';

import { createData } from '@/app/(private)/users/_lib/actions';
import { createSchema, searchParamsCache } from '@/app/(private)/users/_lib/validations';

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  try {
    const searchParamsObject = Object.fromEntries(searchParams.entries());

    const search = searchParamsCache.parse(searchParamsObject);

    const validFilters = getValidFilters(search.filters);

    // Perform the calls concurrently for efficiency
    const [modelData, priorityCounts, statusCounts] = await Promise.all([
      getModelCollection({
        ...search,
        filters: validFilters
      }),
      getModelPriorityCounts(),
      getModelStatusCounts()
    ]);

    // Construct the response
    const response = {
      data: modelData.data,
      pageCount: modelData.pageCount,
      facets: {
        priority: priorityCounts,
        status: statusCounts
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }

    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const validatedData = createSchema.parse(body);

    const result = await createData(validatedData);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: 'Data created successfully' }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
};
