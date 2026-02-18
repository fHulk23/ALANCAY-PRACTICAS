import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jlwoqznezbziseaezjzn.supabase.co";
const supabaseKey = "sb_publishable_Ed9FC2-YN2Av6pc6A2k2mQ_P7dl31du";

export const supabase = createClient(supabaseUrl, supabaseKey);
