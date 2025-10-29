import { useAllRoleQuery } from "@/app/services/roles/rolesApi";
import { Table, Button, Collapse, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import DeleteRole from "../modals/delete/DeleteRole";
import { useGetRoleModalsInfo } from "@/hooks/useGetRoleModalsInfo";
import { useState } from "react";
import { useAllRoleTemplatesQuery } from "@/app/services/role-templates/roleTemplatesApi";
import { fa } from "zod/v4/locales";
import type {
  AllRoleTemplates,
  Role,
} from "@/app/services/role-templates/roleTemplatesTypes";
import type { ApiResponse } from "@/types";
import DeleteRoleTemplate from "../modals/delete/DeleteRoleRoleTemplate";
// import UpdateRole from "../modals/update/UpdateRole";

type Props = {
  // page: number;
  // setPage(page: number): void;

  // limit: number;
  // setLimit(page: number): void;

  templates: {
    id: string;
    name: string;
    roles: Role[];
  }[];

  isLoading: boolean;
};
// : React.FC<Props>
const RoleTemplatesData: React.FC<Props> = ({ templates, isLoading }) =>
  //   {
  //   page,
  //   setPage,
  //   roleTypes,
  // }

  {
    const [isOpen, setOpen] = useState(false);
    const { getInfo, itemInfo } = useGetRoleModalsInfo(setOpen);
    const [roleTemplateTypeId, setRoleTemplateTypeId] = useState("");
    const dataSource = (templates ?? []).map((item) => {
      return {
        key: item.id,
        template: (
          <Collapse
            bordered={false}
            style={{ maxWidth: 800 }}
            size="small"
            items={[
              {
                key: item.id,
                label: `Имя: ${item.name}`,
                children: (
                  <div className="grid gap-2">
                    {item.roles.map((r) => (
                      <strong
                        key={r.id}
                      >{`— ${r.descriptions} [${r.name}]`}</strong>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        ),
        name: item.name,
        actions: (
          <div className="flex gap-5">
            <Button
              color="primary"
              variant="outlined"
              icon={<EditOutlined />}
              // onClick={() => {
              //   setRoleTypeId(item.typeId);
              //   getInfo(item, "UPDATE");
              // }}
            >
              изменить
            </Button>
            <Button
              color="danger"
              variant="outlined"
              icon={<DeleteOutlined />}
              onClick={() => getInfo(item, "DELETE")}
            >
              удалить
            </Button>
          </div>
        ),
      };
    });
    const columns = [
      {
        title: "Шаблон",
        dataIndex: "template",
        key: "template",
      },

      {
        title: "Действия",
        dataIndex: "actions",
        key: "actions",
      },
    ];

    const { name, id, modalType } = itemInfo;

    return (
      <div>
        <Table
          loading={isLoading}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
        <DeleteRoleTemplate
          isOpen={isOpen}
          setOpen={setOpen}
          name={name}
          id={id}
          modalType={modalType}
        />

        {/* <UpdateRole
        isOpen={isOpen}
        setOpen={setOpen}
        name={name}
        id={id}
        modalType={modalType}
        limit={limit}
        page={page}
        descriptions={descriptions as string}
        roleTypeId={roleTypeId}
        roleTypes={roleTypes}
      /> */}
      </div>
    );
  };

export default RoleTemplatesData;
