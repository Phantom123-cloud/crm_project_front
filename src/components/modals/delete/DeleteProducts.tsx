import { Button, Flex, Modal } from "antd";
import type { SetStateAction } from "react";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import { useDeleteProductMutation, useLazyAllProductsQuery } from "@/app/services/products/productsApi";

type Props = {
  isOpen: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
  name: string;
  id: string;
  modalType: "UPDATE" | "DELETE";
};

const DeleteProducts: React.FC<Props> = ({
  isOpen,
  setOpen,
  id,
  name,
  modalType,
}) => {
  const { callMessage } = useUiContext();
  const [deleteProduct] = useDeleteProductMutation();
  const [triggerProducts] = useLazyAllProductsQuery();

  const onCancel = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const { message } = await deleteProduct(id).unwrap();
      await triggerProducts().unwrap();
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
        title={`Вы уверены в удалении - '${name}'`}
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

export default DeleteProducts;
