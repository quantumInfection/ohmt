import { route as supabaseRoute } from './supabase';

export const route = {
  path: 'auth',
  children: [supabaseRoute],
};
