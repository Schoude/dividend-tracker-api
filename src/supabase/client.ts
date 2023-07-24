import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.29.0';
import { load } from 'std/dotenv/mod.ts';
import { Database } from './types.ts';

const env = await load();
const SUPABASE_API_KEY = env['SUPABASE_API_KEY'];
const SUPABASE_URL = env['SUPABASE_URL'];

const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_API_KEY,
  {
    auth: {
      persistSession: false,
    },
  },
);

export { supabase };
