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
        label: "Типы",
        path: "role-types",
      },
      {
        label: "Роли",
        path: "roles",
      },
      {
        label: "Шаблоны",
        path: "role-templates",
      },
    ],
  },
  {
    label: "Пользователи",
    path: "users",
    Icon: TeamOutlined,
  },
  { label: "Страны", path: "citizenships", Icon: GlobalOutlined },
  { label: "Языки", path: "languages", Icon: FontColorsOutlined },
  // { label: "Языки", path: "languages", Icon: FontColorsOutlined },
];
