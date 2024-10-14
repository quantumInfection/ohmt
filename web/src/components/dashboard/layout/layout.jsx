import * as React from 'react';

import { DynamicLayout } from '@/components/dashboard/layout/dynamic-layout';

export function Layout({ children }) {
  return (
    // <AuthGuard>
    <DynamicLayout>{children}</DynamicLayout>
    // </AuthGuard>
  );
}
