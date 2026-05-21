import type { Metadata } from 'next';
import AdminNewsletterContent from '@/components/admin/AdminNewsletterContent';

export const metadata: Metadata = {
  title: 'Admin · Newsletter',
};

export default function AdminNewsletterPage() {
  return <AdminNewsletterContent />;
}
