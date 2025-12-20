import { Button, Flex, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useUiContext } from "@/UIContext";

import { errorMessages } from "@/utils/is-error-message";
import {
  useDeleteTripTypesMutation,
  useLazyAllTripTypesQuery,
} from "@/app/services/trip-types/tripTypesApi";
import { useOnModal } from "@/hooks/useOnModal";

type Props = {
  name: string;
  id: string;
  page: number;
  limit: number;
};

const DeleteTripType: React.FC<Props> = ({ id, name, page, limit }) => {
  const { callMessage } = useUiContext();
  const [deleteTripType] = useDeleteTripTypesMutation();
  const [triggerTripTypes] = useLazyAllTripTypesQuery();

  const { onOpen, onCancel, isOpen } = useOnModal();

  const handleDelete = async () => {
    try {
      const { message } = await deleteTripType(id).unwrap();
      await triggerTripTypes({ page, limit }).unwrap();
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
    </>
  );
};

export default DeleteTripType;
