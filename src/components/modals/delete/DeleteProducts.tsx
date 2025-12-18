import { Button, Flex, Modal } from "antd";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useDeleteProductMutation,
  useLazyAllProductsQuery,
} from "@/app/services/products/productsApi";
import { DeleteOutlined } from "@ant-design/icons";
import { useOnModal } from "@/hooks/useOnModal";

type Props = {
  item: {
    id: string;
    name: string;
  };
  page: number;
  limit: number;
};

const DeleteProducts: React.FC<Props> = ({ page, limit, item }) => {
  const { onOpen, onCancel, isOpen } = useOnModal();
  const { callMessage } = useUiContext();
  const [deleteProduct] = useDeleteProductMutation();
  const [triggerProducts] = useLazyAllProductsQuery();

  const handleDelete = async () => {
    try {
      const { message } = await deleteProduct(item.id).unwrap();
      await triggerProducts({ page, limit }).unwrap();
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
        variant="outlined"
        icon={<DeleteOutlined />}
        onClick={onOpen}
        size="small"
      >
        удалить
      </Button>
      <Modal
        title={`Вы уверены в удалении - '${item.name}'`}
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

export default DeleteProducts;
