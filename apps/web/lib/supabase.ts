import { createClient } from "@supabase/supabase-js"
import { SUPABASE_API_KEY, SUPABASE_URL } from "@/config/env"
import { Database } from "@/types/supabase.types"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_API_KEY)

export default supabase
