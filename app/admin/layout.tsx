import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';
import { AdminProviders } from './providers';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect('/login?redirect=/admin');
  }
  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <AdminProviders>
      <AdminShell>{children}</AdminShell>
    </AdminProviders>
  );
}
