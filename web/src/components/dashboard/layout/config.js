import { paths } from '@/paths';

export const layoutConfig = {
  navItems: [
    {
      key: 'dashboards',
      title: 'Dashboards',
      items: [
        { key: 'cases', title: 'Cases', href: paths.dashboard.overview, icon: 'tool-box' },
      ],
    },
  ],
};
