import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseEnvErrorMessage, getSupabasePublicEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/supabase";

export async function createSupabaseServerClient() {
  const { url, publicKey } = getSupabasePublicEnv();

  if (!url || !publicKey) {
    throw new Error(getSupabaseEnvErrorMessage());
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(url, publicKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // setAll pode ser chamado dentro de Server Components, onde escrita de cookie não é permitida.
        }
      },
    },
  });
}
