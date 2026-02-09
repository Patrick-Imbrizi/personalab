"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnvErrorMessage, getSupabasePublicEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/supabase";

export function createSupabaseBrowserClient() {
  const { url, publicKey } = getSupabasePublicEnv();

  if (!url || !publicKey) {
    throw new Error(getSupabaseEnvErrorMessage());
  }

  return createBrowserClient<Database>(url, publicKey);
}
