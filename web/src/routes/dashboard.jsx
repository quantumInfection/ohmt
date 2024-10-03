import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Layout as DashboardLayout } from '@/components/dashboard/layout/layout';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const CasesList = React.lazy(() => import('@/pages/cases/list').then(module => ({ default: module.Page })));
const EquipmentsList = React.lazy(() => import('@/pages/equipments/list').then(module => ({ default: module.Page })));
const Loader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

export const route = {
  path: 'dashboard',
  element: (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
  children: [
    {
      index: true,
      element: <Navigate to="cases" replace />,
    },
    {
      path: 'cases',
      element: (
        <React.Suspense fallback={<Loader/>}>
          <CasesList />
        </React.Suspense>
      ),
    },
    {
      path: 'equipments',
      element: (
        <React.Suspense fallback={<Loader/>}>
          <EquipmentsList />
        </React.Suspense>
      ),
    },
  ],
};