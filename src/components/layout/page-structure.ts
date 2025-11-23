import {
  FontColorsOutlined,
  GlobalOutlined,
  LockOutlined,
  TeamOutlined,
} from "@ant-design/icons";

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
];
