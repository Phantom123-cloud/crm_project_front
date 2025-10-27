import { LockOutlined } from "@ant-design/icons";

export const pageStructure = [
  {
    label: "Роли",
    path: null,
    Icon: LockOutlined,
    children: [
      {
        label: "Типы",
        path: "role-types",
      },
      {
        label: "Роли",
        path: "roles",
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
