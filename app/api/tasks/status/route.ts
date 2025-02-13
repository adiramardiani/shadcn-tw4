import { NextResponse } from 'next/server';

import { getModelStatusCounts } from '../service';

export const GET = async () => {
  try {
    const counts = await getModelStatusCounts();
    return NextResponse.json(counts);
  } catch (error) {
    console.error('Error fetching status counts:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
};
