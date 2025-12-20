import { Button, Flex, Modal } from "antd";
import { useUiContext } from "@/UIContext";
import {
  useDeleteRolesTypeMutation,
  useLazyAllRolesTypeQuery,
} from "@/app/services/role-types/roleTypesApi";
import { errorMessages } from "@/utils/is-error-message";
import { useOnModal } from "@/hooks/useOnModal";
import { DeleteOutlined } from "@ant-design/icons";
import RolesGuard from "@/components/layout/RolesGuard";

type Props = {
  name: string;
  id: string;
  page: number;
  limit: number;
};

const DeleteRoleType: React.FC<Props> = ({ id, name, page, limit }) => {
  const { callMessage } = useUiContext();
  const [deleteRoleType] = useDeleteRolesTypeMutation();
  const [triggerRoleTypes] = useLazyAllRolesTypeQuery();
  const { onOpen, onCancel, isOpen } = useOnModal();

  const handleDelete = async () => {
    try {
      const { message } = await deleteRoleType(id).unwrap();
      await triggerRoleTypes({ page, limit }).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
    }
  };

  return (
    <RolesGuard access={"delete_role_types"}>
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
    </RolesGuard>
  );
};

export default DeleteRoleType;
