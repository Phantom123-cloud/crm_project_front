import { Button, Flex, Modal } from "antd";
import type { SetStateAction } from "react";
import { useUiContext } from "@/UIContext";
import {
  useDeleteRolesTypeMutation,
  useLazyAllRolesTypeQuery,
} from "@/app/services/roles-type/rolesTypeApi";
import { errorMessages } from "@/utils/is-error-message";

type Props = {
  isOpen: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
  name: string;
  id: string;
  modalType: "CHANGE_NAME" | "DELETE";
};

const DeleteRoleType: React.FC<Props> = ({
  isOpen,
  setOpen,
  id,
  name,
  modalType,
}) => {
  const { callMessage } = useUiContext();
  const [deleteRoleType] = useDeleteRolesTypeMutation();
  const [triggerRoleTypes] = useLazyAllRolesTypeQuery();

  const onCancel = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const { message } = await deleteRoleType(id).unwrap();
      await triggerRoleTypes().unwrap();
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
        title={`Вы уверены в удалении типа - '${name}'`}
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

export default DeleteRoleType;
