import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://naenzjlyvbjodvdjnnbr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hZW56amx5dmJqb2R2ZGpubmJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMzI3NTksImV4cCI6MjA1OTkwODc1OX0.ZmdsSkqXUL_E1R8FvcdHtUS-bfzlK7UywYLuimvOcj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
