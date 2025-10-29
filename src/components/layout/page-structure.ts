import { LockOutlined } from "@ant-design/icons";

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
  // { label: "Files", path: "files", Icon: FileOutlined },
];
