'use client';

import { CourseProvider } from '@/context/CourseContext';
import { EnrollmentProvider } from '@/context/EnrollmentContext';
import { InquiryProvider } from '@/context/InquiryContext';

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <CourseProvider>
      <EnrollmentProvider>
        <InquiryProvider>{children}</InquiryProvider>
      </EnrollmentProvider>
    </CourseProvider>
  );
}
