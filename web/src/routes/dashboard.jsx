import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Navigate, Outlet } from 'react-router-dom';

// import EditEquipment from '@/pages/equipments/EditEquipment';
import { Layout as DashboardLayout } from '@/components/dashboard/layout/layout';

const CasesList = React.lazy(() => import('@/pages/cases/list').then((module) => ({ default: module.Page })));
const AddCase = React.lazy(() => import('@/pages/cases/add-case').then((module) => ({ default: module.Page })));

const EquipmentsList = React.lazy(() => import('@/pages/equipments/list').then((module) => ({ default: module.Page })));
const AddEquipment = React.lazy(() =>
  import('@/pages/equipments/add-equipment').then((module) => ({ default: module.Page }))
);

const ViewEquipment = React.lazy(() =>
  import('@/pages/equipments/view_equipment').then((module) => ({ default: module.Page }))
);

const EditEquipment = React.lazy(() =>
  import('@/pages/equipments/edit-equipment').then((module) => ({ default: module.Page }))
);

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
      element: <Outlet />,
      children: [
        {
          index: true,
          element: (
            <React.Suspense fallback={<Loader />}>
              <CasesList />
            </React.Suspense>
          ),
        },
        {
          path: 'add',
          element: (
            <React.Suspense fallback={<Loader />}>
              <AddCase />
            </React.Suspense>
          ),
        },
      ],
    },
    {
      path: 'equipments',
      element: <Outlet />,
      children: [
        {
          index: true,
          element: (
            <React.Suspense fallback={<Loader />}>
              <EquipmentsList />
            </React.Suspense>
          ),
        },
        {
          path: 'add',
          element: (
            <React.Suspense fallback={<Loader />}>
              <AddEquipment />
            </React.Suspense>
          ),
        },
        {
          path: 'view',
          element: (
            <React.Suspense fallback={<Loader />}>
              <ViewEquipment />
            </React.Suspense>
          ),
        }, 
        
        {
          path: 'edit',
          element: (
            <React.Suspense fallback={<Loader />}>
              <EditEquipment />
            </React.Suspense>
          ),
        },
      ],
    },
  ],
};
