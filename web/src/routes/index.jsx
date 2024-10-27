import * as React from 'react';

import { Page as NotFoundPage } from '@/pages/not-found';

import { route as dashboardRoute } from './dashboard';

import { route as authRoute } from './auth';

export const routes = [dashboardRoute, authRoute, { path: '*', element: <NotFoundPage /> }];
