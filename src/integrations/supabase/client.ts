// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://viaxlwsbhrzwheekrycv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpYXhsd3NiaHJ6d2hlZWtyeWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4ODI4OTcsImV4cCI6MjA1MDQ1ODg5N30.xBk_tmzB8qUjrr60GJTuIq1G0Wks2t1Pkzo0gEmzjIw";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);