import { Button, Flex, Modal } from "antd";
import type { SetStateAction } from "react";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useDeleteRoleMutation,
  useLazyAllRoleQuery,
} from "@/app/services/roles/rolesApi";

type Props = {
  isOpen: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
  name: string;
  id: string;
  modalType: "UPDATE" | "DELETE";
  limit: number;
  page: number;
};

const DeleteRole: React.FC<Props> = ({
  isOpen,
  setOpen,
  id,
  name,
  modalType,
  limit,
  page,
}) => {
  const { callMessage } = useUiContext();
  const [deleteRole] = useDeleteRoleMutation();
  const [triggerRole] = useLazyAllRoleQuery();

  const onCancel = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const { message } = await deleteRole(id).unwrap();
      await triggerRole({ limit, page }).unwrap();
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
        title={`Вы уверены в удалении роли - '${name}'`}
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

export default DeleteRole;
