import { createClient } from "@supabase/supabase-js";

import {
  hasServiceRole,
  supabaseServiceRoleKey,
  supabaseUrl,
} from "@/lib/supabase/env";

export function createSupabaseServiceClient() {
  if (!hasServiceRole() || !supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
