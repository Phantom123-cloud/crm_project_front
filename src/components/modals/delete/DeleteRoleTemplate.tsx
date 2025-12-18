import { Button, Flex, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useDeleteRoleTemplateMutation,
  useLazyAllRoleTemplatesQuery,
} from "@/app/services/role-templates/roleTemplatesApi";
import { useOnModal } from "@/hooks/useOnModal";
import RolesGuard from "@/components/layout/RolesGuard";

type Props = {
  name: string;
  id: string;
  page: number;
  limit: number;
};

const DeleteRoleTemplate: React.FC<Props> = ({ id, name, page, limit }) => {
  const { callMessage } = useUiContext();
  const [deleteRoleTemplate] = useDeleteRoleTemplateMutation();
  const [triggerRoleTemplate] = useLazyAllRoleTemplatesQuery();

  const { onOpen, onCancel, isOpen } = useOnModal();

  const handleDelete = async () => {
    try {
      const { message } = await deleteRoleTemplate(id).unwrap();
      await triggerRoleTemplate({ page, limit }).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
    }
  };

  return (
    <RolesGuard access={"delete_templates"}>
      <Button
        color="danger"
        variant="outlined"
        icon={<DeleteOutlined />}
        onClick={onOpen}
        size="small"
      >
        удалить
      </Button>
      <Modal
        title={`Вы уверены в удалении шаблона - '${name}'`}
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

export default DeleteRoleTemplate;
