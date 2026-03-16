import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  
  // Also check if we can insert a dummy row to test RLS
  const { data: insertData, error: insertError } = await supabase.from('profiles').insert({ id: '00000000-0000-0000-0000-000000000000', full_name: 'test' }).select();

  return NextResponse.json({ data, error, insertData, insertError });
}
