import type { Config } from 'drizzle-kit';

import { databasePrefix } from '@/lib/constants';

const BASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

export default {
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  out: './drizzle',
  dbCredentials: {
    url: BASE_URL
  },
  tablesFilter: [`${databasePrefix}_*`]
} satisfies Config;
