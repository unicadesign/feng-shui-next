'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import Button from '@/components/Button';
import { useCourses } from '@/hooks/useCourses';

const AdminCoursesContent: React.FC = () => {
  const { courses, lessons, loading, togglePublished, deleteCourse } = useCourses();

  const getLessonCount = (courseId: string) =>
    lessons.filter((l) => l.courseId === courseId).length;

  const handleDelete = async (courseId: string, title: string) => {
    if (!confirm(`Da li ste sigurni da želite da obrišete kurs "${title}"?`)) return;
    await deleteCourse(courseId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-navy-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="font-heading text-2xl md:text-3xl text-charcoal">Kursevi</h1>
        <Button to="/admin/courses/new" variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
          Novi kurs
        </Button>
      </div>

      <div className="rounded-2xl bg-cream-50 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="text-left text-charcoal-500 border-b border-sand-200">
                <th className="px-6 py-4 font-semibold">Kurs</th>
                <th className="px-6 py-4 font-semibold">Tip</th>
                <th className="px-6 py-4 font-semibold">Cena</th>
                <th className="px-6 py-4 font-semibold">Lekcije</th>
                <th className="px-6 py-4 font-semibold">Objavljen</th>
                <th className="px-6 py-4 font-semibold">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, i) => (
                <motion.tr
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-sand-100 hover:bg-cream-100/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {course.imageUrl && (
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        />
                      )}
                      <span className="font-heading text-charcoal text-sm">{course.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        course.type === 'standard'
                          ? 'bg-navy-50 text-navy-600'
                          : 'bg-gold-50 text-gold-600'
                      }`}
                    >
                      {course.type === 'standard' ? 'Standardni' : 'Jednokratni'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-charcoal">{course.price}&euro;</span>
                    {course.priceRsd && (
                      <span className="text-charcoal-400 text-xs block">
                        {course.priceRsd.toLocaleString('sr-Latn-RS')} RSD
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-charcoal-500">{getLessonCount(course.id)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublished(course.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        course.published ? 'bg-navy-500' : 'bg-sand-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          course.published ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="p-2 rounded-xl text-charcoal-500 hover:bg-sand-200 hover:text-charcoal transition-all"
                        title="Izmeni"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(course.id, course.title)}
                        className="p-2 rounded-xl text-charcoal-500 hover:bg-red-50 hover:text-red-600 transition-all"
                        title="Obriši"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <p className="font-body text-charcoal-500">Nema kurseva. Kreirajte prvi kurs.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCoursesContent;
