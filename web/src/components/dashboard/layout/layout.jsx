import * as React from 'react';

import { DynamicLayout } from '@/components/dashboard/layout/dynamic-layout';
import { AuthGuard } from '@/components/auth/auth-guard';

export function Layout({ children }) {
  return (
    <AuthGuard>
      <DynamicLayout>{children}</DynamicLayout>
    </AuthGuard>
  );
}
