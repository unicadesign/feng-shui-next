import 'server-only';
import { SiteContent } from '@/types/content';
import { defaultContent } from '@/data/defaultContent';
import { createClient } from '@/lib/supabase/server';

const SUPABASE_PAGES = ['home', 'about', 'services', 'school', 'vaza', 'global'] as const;
type SupabasePage = (typeof SUPABASE_PAGES)[number];

function isSupabasePage(page: keyof SiteContent): page is SupabasePage {
  return (SUPABASE_PAGES as readonly string[]).includes(page as string);
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function deepMerge<T extends Record<string, unknown>>(base: T, overrides: Partial<T>): T {
  const result = { ...base };
  for (const key of Object.keys(overrides) as (keyof T)[]) {
    const val = overrides[key];
    if (
      val &&
      typeof val === 'object' &&
      !Array.isArray(val) &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      result[key] = deepMerge(
        base[key] as Record<string, unknown>,
        val as Record<string, unknown>,
      ) as T[keyof T];
    } else if (val !== undefined) {
      result[key] = val as T[keyof T];
    }
  }
  return result;
}

export async function getContent<K extends keyof SiteContent>(
  page: K,
): Promise<SiteContent[K]> {
  const fallback = deepClone(defaultContent[page]);

  if (!isSupabasePage(page)) {
    return fallback;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_content')
    .select('content')
    .eq('page', page)
    .maybeSingle();

  if (error || !data || !data.content || Object.keys(data.content as object).length === 0) {
    return fallback;
  }

  return deepMerge(
    fallback as unknown as Record<string, unknown>,
    data.content as Record<string, unknown>,
  ) as unknown as SiteContent[K];
}
