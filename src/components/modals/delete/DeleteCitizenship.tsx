import { Button, Flex, Modal } from "antd";
import type { SetStateAction } from "react";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useDeleteCitizenshipMutation,
  useLazyAllCitizenshipsQuery,
} from "@/app/services/citizenships/citizenshipsApi";

type Props = {
  isOpen: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
  localeRu: string;
  id: string;
  modalType: "UPDATE" | "DELETE";
  page: number;
  limit: number;
};

const DeleteCitizenship: React.FC<Props> = ({
  isOpen,
  setOpen,
  id,
  localeRu,
  modalType,
  page,
  limit,
}) => {
  const { callMessage } = useUiContext();
  const [deleteCitizenship] = useDeleteCitizenshipMutation();
  const [triggerCitizenships] = useLazyAllCitizenshipsQuery();

  const onCancel = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const { message } = await deleteCitizenship(id).unwrap();
      await triggerCitizenships({ page, limit }).unwrap();
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
        title={`Вы уверены в удалении страны - '${localeRu}'`}
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

export default DeleteCitizenship;
