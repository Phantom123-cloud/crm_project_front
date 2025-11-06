import { Button, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { CitizenshipAndLanguageData } from "@/app/services/citizenships/citizenshipType";
import type { TModal } from "@/types";
import { useAllLanguagesQuery } from "@/app/services/languages/languagesApi";
import UpdateLanguage from "../modals/update/UpdateLanguage";
import DeleteLanguage from "../modals/delete/DeleteLanguage";

const LanguagesData = () => {
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

  const { data, isLoading } = useAllLanguagesQuery();
  const dataSource = (data?.data ?? []).map((item) => {
    return {
      key: item.id,
      code: item.code,
      localeRu: item.localeRu,
      localeEn: item.localeEn,
      actions: (
        <div className="flex gap-5">
          <Button
            color="primary"
            variant="outlined"
            icon={<EditOutlined />}
            onClick={() => getInfo(item, "UPDATE")}
            size="small"
          >
            изменить
          </Button>
          <Button
            color="danger"
            variant="outlined"
            icon={<DeleteOutlined />}
            onClick={() => getInfo(item, "DELETE")}
            size="small"
          >
            удалить
          </Button>
        </div>
      ),
    };
  });

  const columns = [
    {
      title: "Код языка",
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
      <DeleteLanguage
        isOpen={isOpen}
        setOpen={setOpen}
        localeRu={localeRu}
        id={id}
        modalType={modalType}
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
      />
    </>
  );
};

export default LanguagesData;
