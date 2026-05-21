'use client';

import { ContentProvider } from '@/context/ContentContext';
import { CourseProvider } from '@/context/CourseContext';
import { EnrollmentProvider } from '@/context/EnrollmentContext';
import { InquiryProvider } from '@/context/InquiryContext';
import { NewsletterProvider } from '@/context/NewsletterContext';
import { WebinarProvider } from '@/context/WebinarContext';

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <ContentProvider>
      <CourseProvider>
        <EnrollmentProvider>
          <InquiryProvider>
            <NewsletterProvider>
              <WebinarProvider>{children}</WebinarProvider>
            </NewsletterProvider>
          </InquiryProvider>
        </EnrollmentProvider>
      </CourseProvider>
    </ContentProvider>
  );
}
