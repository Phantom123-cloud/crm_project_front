import { Button, Flex, Modal } from "antd";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useDeleteRoleMutation,
  useLazyAllRoleQuery,
} from "@/app/services/roles/rolesApi";
import { DeleteOutlined } from "@ant-design/icons";
import { useOnModal } from "@/hooks/useOnModal";

type Props = {
  name: string;
  id: string;
  limit: number;
  page: number;
};

const DeleteRole: React.FC<Props> = ({ id, name, limit, page }) => {
  const { callMessage } = useUiContext();
  const [deleteRole] = useDeleteRoleMutation();
  const [triggerRole] = useLazyAllRoleQuery();
  const { onOpen, onCancel, isOpen } = useOnModal();

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
    <>
      <Button
        color="danger"
        size="small"
        variant="outlined"
        icon={<DeleteOutlined />}
        onClick={onOpen}
      >
        удалить
      </Button>
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
    </>
  );
};

export default DeleteRole;
