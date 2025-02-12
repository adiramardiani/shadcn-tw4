import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

const BASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

const client = postgres(BASE_URL);
export const db = drizzle(client, { schema });
