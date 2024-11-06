import { paths } from '@/paths';

export const layoutConfig = {
  navItems: [
    {
      key: 'dashboards',
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
        {
          key: 'consumables',
          title: 'Consumable',
          href: paths.dashboard.consumables.list,
          icon: 'list-dashes',
        },
      ],
    },

  ],
};
