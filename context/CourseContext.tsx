'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import type {
  Course, CourseModule, Lesson,
  CourseRow, CourseModuleRow, LessonRow, LessonVideoRow,
  CourseInsert, CourseModuleInsert, LessonInsert, LessonVideoInsert,
} from '@/types';
import { toCourse, toCourseModule, toLesson } from '@/types';

export interface LessonVideoSaveData {
  sort_order: number;
  title: string;
  video_path: string | null;
  video_url: string;
}

interface CourseContextType {
  courses: Course[];
  modules: CourseModule[];
  lessons: Lesson[];
  loading: boolean;
  refreshCourses: () => Promise<void>;
  saveCourse: (
    courseData: Partial<CourseInsert> & { id?: string },
    modulesData: (Partial<CourseModuleInsert> & { id?: string; _tempId?: string })[],
    lessonsData: (Partial<LessonInsert> & { id?: string; _tempModuleId?: string; videos?: LessonVideoSaveData[] })[],
  ) => Promise<{ success: boolean; error?: string; courseId?: string }>;
  deleteCourse: (id: string) => Promise<{ success: boolean; error?: string }>;
  togglePublished: (id: string) => Promise<void>;
}

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCourses = useCallback(async () => {
    setLoading(true);

    const [coursesRes, modulesRes, lessonsRes, videosRes] = await Promise.all([
      supabase.from('courses').select('*').order('created_at', { ascending: false }),
      supabase.from('course_modules').select('*').order('order_index', { ascending: true }),
      supabase.from('lessons').select('*').order('week_number', { ascending: true }),
      supabase.from('lesson_videos').select('*').order('sort_order', { ascending: true }),
    ]);

    if (!coursesRes.error && coursesRes.data) {
      setCourses((coursesRes.data as CourseRow[]).map(toCourse));
    }
    if (!modulesRes.error && modulesRes.data) {
      setModules((modulesRes.data as CourseModuleRow[]).map(toCourseModule));
    }
    if (!lessonsRes.error && lessonsRes.data) {
      const videosByLesson: Record<string, LessonVideoRow[]> = {};
      if (!videosRes.error && videosRes.data) {
        for (const row of videosRes.data as LessonVideoRow[]) {
          (videosByLesson[row.lesson_id] ||= []).push(row);
        }
      }
      setLessons(
        (lessonsRes.data as LessonRow[]).map((row) =>
          toLesson(row, videosByLesson[row.id] ?? [])
        )
      );
    }

    setLoading(false);
  }, []);

  const saveCourse = useCallback(async (
    courseData: Partial<CourseInsert> & { id?: string },
    modulesData: (Partial<CourseModuleInsert> & { id?: string; _tempId?: string })[],
    lessonsData: (Partial<LessonInsert> & { id?: string; _tempModuleId?: string; videos?: LessonVideoSaveData[] })[],
  ): Promise<{ success: boolean; error?: string; courseId?: string }> => {
    try {
      let courseId: string;

      if (courseData.id) {
        courseId = courseData.id;
        const { id: _id, ...updateData } = courseData;
        void _id;
        const { error } = await supabase
          .from('courses')
          .update(updateData)
          .eq('id', courseId);
        if (error) return { success: false, error: error.message };
      } else {
        const { id: _id, ...insertData } = courseData;
        void _id;
        const { data, error } = await supabase
          .from('courses')
          .insert([insertData])
          .select('id')
          .single();
        if (error || !data) return { success: false, error: error?.message || 'Greška pri kreiranju kursa' };
        courseId = data.id;
      }

      await supabase.from('course_modules').delete().eq('course_id', courseId);

      const moduleIdMap: Record<string, string> = {};

      if (modulesData.length > 0) {
        const moduleInserts: CourseModuleInsert[] = modulesData.map((m) => ({
          course_id: courseId,
          order_index: m.order_index ?? 1,
          title: m.title ?? '',
          description: m.description ?? '',
          is_vaza_izobilja: m.is_vaza_izobilja ?? false,
        }));

        const { data: savedModules, error: modErr } = await supabase
          .from('course_modules')
          .insert(moduleInserts)
          .select('id');

        if (modErr) return { success: false, error: modErr.message };

        if (savedModules) {
          modulesData.forEach((m, i) => {
            const key = m._tempId || m.id || `idx-${i}`;
            moduleIdMap[key] = savedModules[i].id;
          });
        }
      }

      await supabase.from('lessons').delete().eq('course_id', courseId);

      if (lessonsData.length > 0) {
        const lessonInserts: LessonInsert[] = lessonsData.map((l) => {
          let resolvedModuleId: string | null = null;
          if (l._tempModuleId && moduleIdMap[l._tempModuleId]) {
            resolvedModuleId = moduleIdMap[l._tempModuleId];
          } else if (l.module_id && moduleIdMap[l.module_id]) {
            resolvedModuleId = moduleIdMap[l.module_id];
          } else if (l.module_id) {
            resolvedModuleId = l.module_id;
          }

          return {
            course_id: courseId,
            module_id: resolvedModuleId,
            week_number: l.week_number ?? 1,
            title: l.title ?? '',
            description: l.description ?? '',
            video_url: l.video_url ?? '',
            video_path: l.video_path ?? null,
            is_vaza_izobilja: l.is_vaza_izobilja ?? false,
            available_after_weeks: l.available_after_weeks ?? 0,
            has_qand_a: l.has_qand_a ?? false,
            has_practical_exercise: l.has_practical_exercise ?? false,
            has_online_test: l.has_online_test ?? false,
          };
        });

        const { data: savedLessons, error: lesErr } = await supabase
          .from('lessons')
          .insert(lessonInserts)
          .select('id');

        if (lesErr) return { success: false, error: lesErr.message };

        if (savedLessons) {
          const videoInserts: LessonVideoInsert[] = [];
          lessonsData.forEach((l, i) => {
            const newLessonId = savedLessons[i]?.id;
            if (!newLessonId || !l.videos) return;
            l.videos.forEach((v, vi) => {
              videoInserts.push({
                lesson_id: newLessonId,
                sort_order: v.sort_order ?? vi,
                title: v.title ?? '',
                video_path: v.video_path ?? null,
                video_url: v.video_url ?? '',
              });
            });
          });

          if (videoInserts.length > 0) {
            const { error: lvErr } = await supabase
              .from('lesson_videos')
              .insert(videoInserts);
            if (lvErr) return { success: false, error: lvErr.message };
          }
        }
      }

      await refreshCourses();
      return { success: true, courseId };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Nepoznata greška';
      return { success: false, error: message };
    }
  }, [refreshCourses]);

  const deleteCourse = useCallback(async (id: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) return { success: false, error: error.message };

    setCourses((prev) => prev.filter((c) => c.id !== id));
    setModules((prev) => prev.filter((m) => m.courseId !== id));
    setLessons((prev) => prev.filter((l) => l.courseId !== id));
    return { success: true };
  }, []);

  const togglePublished = useCallback(async (id: string) => {
    const course = courses.find((c) => c.id === id);
    if (!course) return;

    const newPublished = !course.published;
    await supabase.from('courses').update({ published: newPublished }).eq('id', id);
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, published: newPublished } : c))
    );
  }, [courses]);

  useEffect(() => {
    refreshCourses();
  }, [refreshCourses]);

  return (
    <CourseContext.Provider
      value={{ courses, modules, lessons, loading, refreshCourses, saveCourse, deleteCourse, togglePublished }}
    >
      {children}
    </CourseContext.Provider>
  );
};
