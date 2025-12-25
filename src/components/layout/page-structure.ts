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

  ...(isAcces("view_trips")
    ? [
        {
          label: "Выезда",
          path: null,
          Icon: CarOutlined,
          children: [
            ...(isAcces("view_trips")
              ? [
                  {
                    label: "Список выездов",
                    path: "trips",
                  },
                ]
              : []),
            ...(isAcces("view_trip_types")
              ? [
                  {
                    label: "Типы",
                    path: "trip-types",
                  },
                ]
              : []),
          ],
        },
      ]
    : []),

  ...(isAcces("view_warehouses")
    ? [
        {
          label: "Склады",
          path: null,
          Icon: Warehouse,
          children: [
            ...(isAcces("view_warehouses")
              ? [
                  {
                    label: "Список складов",
                    path: "warehouses",
                  },
                ]
              : []),
            ...(isAcces("view_products")
              ? [
                  {
                    label: "Товар",
                    path: "products",
                  },
                ]
              : []),
          ],
        },
      ]
    : []),
];
