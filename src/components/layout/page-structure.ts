import {
  CarOutlined,
  FontColorsOutlined,
  GlobalOutlined,
  LockOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Warehouse } from "lucide-react";

export const pageStructure = (isAcces: (access: string) => boolean) => [
  ...(isAcces("view_roles")
    ? [
        {
          label: "Роли",
          path: null,
          Icon: LockOutlined,
          children: [
            ...(isAcces("view_role_types")
              ? [
                  {
                    label: "Типы",
                    path: "role-types",
                  },
                ]
              : []),

            ...(isAcces("view_roles")
              ? [
                  {
                    label: "Роли",
                    path: "roles",
                  },
                ]
              : []),
            ...(isAcces("view_templates")
              ? [
                  {
                    label: "Шаблоны",
                    path: "role-templates",
                  },
                ]
              : []),
          ],
        },
      ]
    : []),
  ...(isAcces("view_users")
    ? [
        {
          label: "Пользователи",
          path: "users",
          Icon: TeamOutlined,
        },
      ]
    : []),
  ...(isAcces("view_citizenships")
    ? [
        {
          label: "Страны",
          path: "citizenships",
          Icon: GlobalOutlined,
        },
      ]
    : []),
  ...(isAcces("view_languages")
    ? [{ label: "Языки", path: "languages", Icon: FontColorsOutlined }]
    : []),

  {
    label: "Выезда",
    path: null,
    Icon: CarOutlined,
    children: [
      {
        label: "Список выездов",
        path: "trips",
      },
      {
        label: "Типы",
        path: "trip-types",
      },
    ],
  },
  {
    label: "Склады",
    path: null,
    Icon: Warehouse,
    children: [
      {
        label: "Список складов",
        path: "warehouses",
      },
    ],
  },
];
