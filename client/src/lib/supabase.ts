import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://clqxyfdfehpwifxbjgfl.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNscXh5ZmRmZWhwd2lmeGJqZ2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTEyMzgsImV4cCI6MjA3Mjk4NzIzOH0.WH9XImx0BIBDHxJAtKvWPl-EAQ-b1F3NvZjPoVMcDAg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)