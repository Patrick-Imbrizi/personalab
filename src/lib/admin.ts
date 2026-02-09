import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

export async function isAdminUser(
  supabase: SupabaseClient<Database>,
  user: User,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return false;
  }

  return Boolean(data?.user_id);
}
