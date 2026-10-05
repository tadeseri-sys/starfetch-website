import { createClient } from "@supabase/supabase-js";


export function getSupabaseAdmin() {

  const supabaseUrl =
    process.env.SUPABASE_URL;

  const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY;


  if (!supabaseUrl) {
    throw new Error(
      "SUPABASE_URL environment variable is missing."
    );
  }


  if (!supabaseSecretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY environment variable is missing."
    );
  }


  return createClient(
    supabaseUrl,
    supabaseSecretKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  );

}