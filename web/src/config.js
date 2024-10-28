import { AuthStrategy } from '@/lib/auth/strategy';
import { getSiteURL } from '@/lib/get-site-url';
import { LogLevel } from '@/lib/logger';

export const config = {
  site: {
    name: 'OHMT',
    description: '',
    language: 'en',
    colorScheme: 'light',
    themeColor: '#090a0b',
    primaryColor: 'tomatoOrange',
    url: getSiteURL(),
    version: import.meta.env.VITE_SITE_VERSION || '0.0.0',
  },
  logLevel: import.meta.env.VITE_LOG_LEVEL || LogLevel.ALL,
  auth: { strategy: import.meta.env.VITE_AUTH_STRATEGY || AuthStrategy.SUPABASE },
  supabase: { url: import.meta.env.VITE_SUPABASE_URL, anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY },
  mapbox: { apiKey: import.meta.env.VITE_MAPBOX_API_KEY },
  gtm: { id: import.meta.env.VITE_GOOGLE_TAG_MANAGER_ID },
};
