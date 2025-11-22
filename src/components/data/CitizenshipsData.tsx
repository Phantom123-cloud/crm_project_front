import { Button, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAllCitizenshipsQuery } from "@/app/services/citizenships/citizenshipsApi";
import DeleteCitizenship from "../modals/delete/DeleteCitizenship";
import type { CitizenshipAndLanguageData } from "@/app/services/citizenships/citizenshipType";
import type { TModal } from "@/types";
import RolesGuard from "../layout/RolesGuard";
import UpdateCitizenships from "../modals/update/UpdateCitizenships";

const CitizenshipsData = () => {
  const [isOpen, setOpen] = useState(false);
  const [itemInfo, setItemInfo] = useState<CitizenshipAndLanguageData>({
    id: "",
    code: "",
    localeRu: "",
    localeEn: "",
  });
  const [modalType, setModalType] = useState<TModal>("UPDATE");
  const getInfo = (item: CitizenshipAndLanguageData, type: TModal) => {
    setItemInfo((prev) => ({ ...prev, ...item }));
    setModalType(type);
    setOpen(true);
  };

  const { data, isLoading } = useAllCitizenshipsQuery();

  const dataSource = (data?.data ?? []).map((item) => {
    return {
      key: item.id,
      code: item.code,
      localeRu: item.localeRu,
      localeEn: item.localeEn,
      actions: (
        <div className="flex gap-5">
          <RolesGuard access={"update_citizenships"}>
            <Button
              color="primary"
              variant="outlined"
              size="small"
              icon={<EditOutlined />}
              onClick={() => getInfo(item, "UPDATE")}
            >
              изменить
            </Button>
          </RolesGuard>
          <RolesGuard access={"delete_citizenships"}>
            <Button
              color="danger"
              variant="outlined"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => getInfo(item, "DELETE")}
            >
              удалить
            </Button>
          </RolesGuard>
        </div>
      ),
    };
  });

  const columns = [
    {
      title: "Код страны",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Название (ру)",
      dataIndex: "localeRu",
      key: "localeRu",
    },
    {
      title: "Название (eng)",
      dataIndex: "localeEn",
      key: "localeEn",
    },
    {
      title: "Действия",
      dataIndex: "actions",
      key: "actions",
    },
  ];
  const { localeRu, id, localeEn, code } = itemInfo;
  return (
    <>
      <Table
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <UpdateCitizenships
        isOpen={isOpen}
        setOpen={setOpen}
        localeRu={localeRu}
        localeEn={localeEn}
        code={code}
        id={id}
        modalType={modalType}
        loading={isLoading}
      />
      <DeleteCitizenship
        isOpen={isOpen}
        setOpen={setOpen}
        localeRu={localeRu}
        id={id}
        modalType={modalType}
      />
    </>
  );
};

export default CitizenshipsData;
