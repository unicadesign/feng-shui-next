import type { Metadata } from 'next';
import DashboardContent from '@/components/dashboard/DashboardContent';

export const metadata: Metadata = {
  title: 'Moji kursevi',
  description: 'Vaš lični prostor za upravljanje upisanim kursevima i praćenje napretka.',
};

export default function DashboardPage() {
  return <DashboardContent />;
}
