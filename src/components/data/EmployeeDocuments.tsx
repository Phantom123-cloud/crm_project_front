import { Button, Badge, Modal, Flex } from "antd";
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { useDownloadFile } from "@/hooks/useDownloadFile";
import { useDeleteFileMutation } from "@/app/services/files/filesApi";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import { useLazyUserByIdQuery } from "@/app/services/users/usersApi";
import PassportImage from "../UI/PassportImage";
import FormPassportFiles from "../forms/FormPassportFiles";
import RolesGuard from "../layout/RolesGuard";
import { useState } from "react";

type Props = {
  userId: string;
  passports: string[];
};

const EmployeeDocuments: React.FC<Props> = ({ userId, passports }) => {
  const { handleDownload } = useDownloadFile();
  const [deleteFile] = useDeleteFileMutation();
  const { callMessage } = useUiContext();
  const [triggerUserData] = useLazyUserByIdQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [fileDeleteName, setFileDeleteName] = useState<null | string>(null);
  const onCancel = () => {
    setFileDeleteName(null);
    setIsOpen(false);
  };
  const handleDelete = async (fileName: string, userId: string) => {
    try {
      const { message } = await deleteFile({
        userId,
        fileName,
      }).unwrap();
      await triggerUserData(userId).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
    }
  };

  const onOpen = (fileName: string) => {
    setFileDeleteName(fileName);
    setIsOpen(true);
  };

  return (
    <div>
      <RolesGuard access={"import_employee_passports"}>
        <FormPassportFiles userId={userId} />
      </RolesGuard>
      <div className="grid gap-4 justify-center grid-cols-1 2xl:grid-cols-3">
        {passports.map((fileName, index) => (
          <div className="p-2" key={fileName + index}>
            <div className="flex justify-center items-center code-box">
              <PassportImage fileName={fileName} />
            </div>
            <div className="flex justify-between items-center gap-4 mt-2">
              <Badge count={index + 1} />
              <div className="flex items-center gap-2">
                <RolesGuard access={"download_employee_passports"}>
                  <Button
                    color="primary"
                    variant="solid"
                    icon={<DownloadOutlined />}
                    onClick={() => {
                      handleDownload(fileName, userId);
                    }}
                  >
                    Скачать
                  </Button>
                </RolesGuard>
                <RolesGuard access={"delete_employee_passports"}>
                  <Button
                    color="danger"
                    variant="solid"
                    icon={<DeleteOutlined />}
                    onClick={() => onOpen(fileName)}
                  >
                    Удалить
                  </Button>
                </RolesGuard>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={"Подтвердите удаление"}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpen}
        footer={null}
        onCancel={onCancel}
      >
        <Flex justify="space-between">
          <Button
            variant="solid"
            color="danger"
            onClick={() => {
              fileDeleteName && handleDelete(fileDeleteName, userId);
            }}
          >
            Удалить
          </Button>

          <Button onClick={onCancel} variant="solid" color="default">
            Закрыть
          </Button>
        </Flex>
      </Modal>
    </div>
  );
};

export default EmployeeDocuments;
