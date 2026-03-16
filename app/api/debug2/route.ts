import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();
  
  const updates = {
    full_name: 'test update 2',
  };

  const { error: updateError } = await supabase.from('profiles').update(updates).eq('id', 'b7a01ea3-97e1-4c8b-9e6e-20537f371341');
  
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', 'b7a01ea3-97e1-4c8b-9e6e-20537f371341').single();

  return NextResponse.json({ updateError, profile });
}
