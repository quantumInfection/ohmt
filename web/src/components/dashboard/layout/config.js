import { paths } from '@/paths';

export const layoutConfig = {
  navItems: [
    {
      key: 'dashboards',
      items: [
        { key: 'cases', title: 'Cases', href: paths.dashboard.cases.list, icon: 'tool-box' },
        {
          key: 'equipments',
          title: 'Equipments',
          href: paths.dashboard.equipments.list,
          icon: 'chart-pie',
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
