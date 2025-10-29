/**
 * Dashboard Page - Server Component with Suspense
 */

import { Suspense } from 'react';
import { DashboardContent } from './DashboardContent';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
