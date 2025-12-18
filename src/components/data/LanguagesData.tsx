import { Button, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { CitizenshipAndLanguageData } from "@/app/services/citizenships/citizenshipType";
import type { TModal } from "@/types";
import UpdateLanguage from "../modals/update/UpdateLanguage";
import DeleteLanguage from "../modals/delete/DeleteLanguage";
import RolesGuard from "../layout/RolesGuard";

type Props = {
  languages: CitizenshipAndLanguageData[];
  isLoading: boolean;
  page: number;
  limit: number;
  setPage(page: number): void;
  setLimit(page: number): void;
  total: number;
};

const LanguagesData: React.FC<Props> = ({
  languages,
  isLoading,
  page,
  limit,
  setPage,
  setLimit,
  total,
}) => {
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

  const dataSource = languages.map((item) => {
    return {
      key: item.id,
      code: item.code,
      localeRu: item.localeRu,
      localeEn: item.localeEn,
      actions: (
        <div className="flex gap-5">
          <RolesGuard access={"update_languages"}>
            <Button
              color="primary"
              variant="outlined"
              icon={<EditOutlined />}
              onClick={() => getInfo(item, "UPDATE")}
              size="small"
            >
              изменить
            </Button>
          </RolesGuard>
          <RolesGuard access={"delete_languages"}>
            <Button
              color="danger"
              variant="outlined"
              icon={<DeleteOutlined />}
              onClick={() => getInfo(item, "DELETE")}
              size="small"
            >
              удалить
            </Button>{" "}
          </RolesGuard>
        </div>
      ),
    };
  });

  const columns = [
    {
      title: "Код",
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
        pagination={{
          pageSize: limit,
          total,
          current: page,
          onChange: (page, limit) => {
            setPage(page);
            setLimit(limit);
          },
          showSizeChanger: true,
        }}
      />
      <DeleteLanguage
        isOpen={isOpen}
        setOpen={setOpen}
        localeRu={localeRu}
        id={id}
        modalType={modalType}
        page={page}
        limit={limit}
      />
      <UpdateLanguage
        isOpen={isOpen}
        setOpen={setOpen}
        localeRu={localeRu}
        localeEn={localeEn}
        code={code}
        id={id}
        modalType={modalType}
        loading={isLoading}
        page={page}
        limit={limit}
      />
    </>
  );
};

export default LanguagesData;
