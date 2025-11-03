import {
  FontColorsOutlined,
  GlobalOutlined,
  LockOutlined,
  TeamOutlined,
} from "@ant-design/icons";

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
  {
    label: "Люди",
    path: null,
    Icon: TeamOutlined,
    children: [
      {
        label: "аккаунты",
        path: "accounts",
      },
      {
        label: "сотрудники",
        path: "employees",
      },
    ],
  },
  { label: "Страны", path: "citizenships", Icon: GlobalOutlined },
  { label: "Языки", path: "languages", Icon: FontColorsOutlined },
  // { label: "Языки", path: "languages", Icon: FontColorsOutlined },
];
