import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rggmcwzkljndvytgedhy.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZD_AQ6xbcgAVuxBEn9_xMg_KlUV2bwf';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);