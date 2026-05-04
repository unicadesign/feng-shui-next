'use client';

import { ContentProvider } from '@/context/ContentContext';
import { CourseProvider } from '@/context/CourseContext';
import { EnrollmentProvider } from '@/context/EnrollmentContext';
import { InquiryProvider } from '@/context/InquiryContext';

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <ContentProvider>
      <CourseProvider>
        <EnrollmentProvider>
          <InquiryProvider>{children}</InquiryProvider>
        </EnrollmentProvider>
      </CourseProvider>
    </ContentProvider>
  );
}
