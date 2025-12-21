import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // During build time or misconfiguration, return a dummy or throw
    console.warn('Supabase Admin Client: URL or Key missing. Some features may fail.');
    // Return a dummy object or throw a handled error if critical. 
    // For build safety, we might want to return a mock or just let it fail GRACEFULLY.
    // But `supabase-js` throws if key is empty.
    // Let's return a "broken" client that throws on any method call, or just allow it to fail later.
    // Better: throw a clear error here so we know WHY it failed, 
    // BUT for build time (if envs are missing), maybe we shouldn't crash immediately if code path isn't used.
    
    // However, since this is used in functions, usually only at runtime.
    // If it's failing at build time, it means some page is trying to use it for SSG.
    
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
        // In Vercel build, this might be called.
    }
  }

  // Safe check
  if (!key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is undefined');
  }

  return createClient(url!, key)
}
