'use client';

import { CourseProvider } from '@/context/CourseContext';
import { EnrollmentProvider } from '@/context/EnrollmentContext';

export function DashboardProviders({ children }: { children: React.ReactNode }) {
  return (
    <CourseProvider>
      <EnrollmentProvider>{children}</EnrollmentProvider>
    </CourseProvider>
  );
}
