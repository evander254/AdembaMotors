import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nfmyyjfqvrbzopiadrsj.supabase.co'
const supabaseKey = 'sb_publishable_2WHgmT9rjINCzZk4gVIJpQ_Gin2JbB4'

export const supabase = createClient(supabaseUrl, supabaseKey)
