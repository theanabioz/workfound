import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.rpc('get_columns', { table_name: 'profiles' });
  if (error) {
    // maybe we can query information_schema directly if we use a raw query, but supabase JS doesn't support it easily.
    // Let's just try to select 1 row and see its keys.
    const { data: profiles } = await supabase.from('profiles').select('*').limit(1);
    return NextResponse.json({ columns: profiles && profiles.length > 0 ? Object.keys(profiles[0]) : [] });
  }

  return NextResponse.json({ data });
}
