import { Button, Flex, Modal } from "antd";
import type { SetStateAction } from "react";
import { useUiContext } from "@/UIContext";
import {
  useDeleteRolesTypeMutation,
  useLazyAllRolesTypeQuery,
} from "@/app/services/role-types/roleTypesApi";
import { errorMessages } from "@/utils/is-error-message";
import { useDeleteTripTypesMutation, useLazyAllTripTypesQuery } from "@/app/services/trip-types/tripTypesApi";

type Props = {
  isOpen: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
  name: string;
  id: string;
  modalType: "UPDATE" | "DELETE";
};

const DeleteTripType: React.FC<Props> = ({
  isOpen,
  setOpen,
  id,
  name,
  modalType,
}) => {
  const { callMessage } = useUiContext();
  const [deleteTripType] = useDeleteTripTypesMutation();
  const [triggerTripTypes] = useLazyAllTripTypesQuery();

  const onCancel = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const { message } = await deleteTripType(id).unwrap();
      await triggerTripTypes().unwrap();
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

export default DeleteTripType;
