import { FontColorsOutlined, GlobalOutlined, LockOutlined } from "@ant-design/icons";

export const pageStructure = [
  {
    label: "Роли",
    path: null,
    Icon: LockOutlined,
    children: [
      {
        label: "типы",
        path: "role-types",
      },
      {
        label: "роли",
        path: "roles",
      },
      {
        label: "шаблоны",
        path: "role-templates",
      },
    ],
  },
  // {
  //   label: "Team",
  //   path: null,
  //   Icon: TeamOutlined,
  //   children: [
  //     {
  //       label: "Team 1",
  //       path: "t-1",
  //     },
  //     {
  //       label: "Team 2",
  //       path: "t-2",
  //     },
  //   ],
  // },
  { label: "Страны", path: "citizenships", Icon: GlobalOutlined },
  { label: "Языки", path: "languages", Icon: FontColorsOutlined },
];
