'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { SiteContent } from '@/types/content';
import { defaultContent } from '@/data/defaultContent';
import { supabase } from '@/lib/supabase/client';

const STORAGE_KEY = 'ptplan_content';

const SUPABASE_PAGES: (keyof SiteContent)[] = ['home', 'about', 'services', 'school', 'vaza', 'global'];

interface ContentContextType {
  content: SiteContent;
  updatePageContent: <K extends keyof SiteContent>(page: K, data: SiteContent[K]) => void;
  resetPageContent: (page: keyof SiteContent) => void;
  resetAllContent: () => void;
}

export const ContentContext = createContext<ContentContextType | null>(null);

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function deepMerge<T extends Record<string, unknown>>(base: T, overrides: Partial<T>): T {
  const result = { ...base };
  for (const key of Object.keys(overrides) as (keyof T)[]) {
    const val = overrides[key];
    if (val && typeof val === 'object' && !Array.isArray(val) && typeof base[key] === 'object' && !Array.isArray(base[key])) {
      result[key] = deepMerge(base[key] as Record<string, unknown>, val as Record<string, unknown>) as T[keyof T];
    } else if (val !== undefined) {
      result[key] = val as T[keyof T];
    }
  }
  return result;
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    if (typeof window === 'undefined') {
      return deepClone(defaultContent);
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...deepClone(defaultContent), ...parsed };
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    return deepClone(defaultContent);
  });

  useEffect(() => {
    const loadSupabaseContent = async () => {
      for (const page of SUPABASE_PAGES) {
        const { data, error } = await supabase
          .from('site_content')
          .select('content')
          .eq('page', page)
          .single();

        if (!error && data && data.content && Object.keys(data.content).length > 0) {
          setContent(prev => ({
            ...prev,
            [page]: deepMerge(
              deepClone(defaultContent[page]) as unknown as Record<string, unknown>,
              data.content as Record<string, unknown>
            ),
          }));
        }
      }
    };

    loadSupabaseContent();
  }, []);

  const updatePageContent = useCallback(<K extends keyof SiteContent>(page: K, data: SiteContent[K]) => {
    setContent(prev => {
      const next = { ...prev, [page]: data };

      if (SUPABASE_PAGES.includes(page)) {
        supabase
          .from('site_content')
          .upsert({ page, content: data, updated_at: new Date().toISOString() })
          .then(({ error }) => {
            if (error) console.error('Failed to save content to Supabase:', error.message);
          });
      } else if (typeof window !== 'undefined') {
        const localPages = { ...next };
        for (const sp of SUPABASE_PAGES) {
          delete (localPages as Record<string, unknown>)[sp];
        }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(localPages));
      }

      return next;
    });
  }, []);

  const resetPageContent = useCallback((page: keyof SiteContent) => {
    setContent(prev => {
      const next = { ...prev, [page]: deepClone(defaultContent[page]) };

      if (SUPABASE_PAGES.includes(page)) {
        supabase
          .from('site_content')
          .upsert({ page, content: {}, updated_at: new Date().toISOString() })
          .then(({ error }) => {
            if (error) console.error('Failed to reset content in Supabase:', error.message);
          });
      } else if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }

      return next;
    });
  }, []);

  const resetAllContent = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    for (const page of SUPABASE_PAGES) {
      supabase
        .from('site_content')
        .upsert({ page, content: {}, updated_at: new Date().toISOString() })
        .then(({ error }) => {
          if (error) console.error('Failed to reset content in Supabase:', error.message);
        });
    }
    setContent(deepClone(defaultContent));
  }, []);

  return (
    <ContentContext.Provider value={{ content, updatePageContent, resetPageContent, resetAllContent }}>
      {children}
    </ContentContext.Provider>
  );
};
