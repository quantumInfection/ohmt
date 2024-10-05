import * as React from 'react';

import { Page as NotFoundPage } from '@/pages/not-found';

import { route as dashboardRoute } from './dashboard';

export const routes = [dashboardRoute, { path: '*', element: <NotFoundPage /> }];
