import { Button, Flex, Modal } from "antd";
import type { SetStateAction } from "react";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import { useDeleteLanguageMutation, useLazyAllLanguagesQuery } from "@/app/services/languages/languagesApi";

type Props = {
  isOpen: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
  localeRu: string;
  id: string;
  modalType: "UPDATE" | "DELETE";
};

const DeleteLanguage: React.FC<Props> = ({
  isOpen,
  setOpen,
  id,
  localeRu,
  modalType,
}) => {
  const { callMessage } = useUiContext();
  const [deleteLanguage] = useDeleteLanguageMutation();
  const [triggerLanguages] = useLazyAllLanguagesQuery();

  const onCancel = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const { message } = await deleteLanguage(id).unwrap();
      await triggerLanguages().unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
    }
  };

  return (
    modalType === "DELETE" && (
      <Modal
        title={`Вы уверены в удалении языка - '${localeRu}'`}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpen}
        footer={null}
        onCancel={onCancel}
      >
        <Flex justify="space-between">
          <Button variant="solid" color="danger" onClick={handleDelete}>
            Удалить
          </Button>

          <Button onClick={onCancel} variant="solid" color="default">
            Закрыть
          </Button>
        </Flex>
      </Modal>
    )
  );
};

export default DeleteLanguage;
