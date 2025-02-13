import { NextResponse } from 'next/server';

import { getModelPriorityCounts } from '../service';

export const GET = async () => {
  try {
    const counts = await getModelPriorityCounts();
    return NextResponse.json(counts);
  } catch (error) {
    console.error('Error fetching priority counts:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
};
