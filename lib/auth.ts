import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { User } from '@/types';

/**
 * Server-side helper — call from server components, layouts, route handlers.
 * Returns the merged auth + profile record (matching the User shape used in
 * client code) or null if no session is active.
 *
 * Use this for auth gates: read it at the top of a layout or page, redirect
 * if needed. Don't call from client components — use useAuth() instead.
 */
export async function getUser(): Promise<User | null> {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  return {
    id: authUser.id,
    email: authUser.email || '',
    name: profile?.name || '',
    role: profile?.role || 'user',
    createdAt: profile?.created_at?.split('T')[0] || '',
  };
}

export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  return user?.role === 'admin';
}
