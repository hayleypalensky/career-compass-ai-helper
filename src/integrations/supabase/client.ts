
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database, Json } from './types';

const SUPABASE_URL = "https://ilrrxwkxrbgslpifkdlf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlscnJ4d2t4cmJnc2xwaWZrZGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTY3MTYsImV4cCI6MjA2MzMzMjcxNn0.pKX2Uzg7DT3H5v7OhUXySAuktLCwk05Rm3ZB3_-XaJ4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

export { Json };
