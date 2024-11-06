import { paths } from '@/paths';

export const layoutConfig = {
  navItems: [
    {
      key: 'equipments',
      items: [
        {
          key: 'equipments',
          title: 'Equipment',
          icon: 'chart-pie',
          items: [
            { key: 'equipments', title: 'Equipment List', href: paths.dashboard.equipments.list },
            { key: 'cases', title: 'Cases', href: paths.dashboard.cases.list },
          ],
        },
     
      ],
    },

  ],
};
