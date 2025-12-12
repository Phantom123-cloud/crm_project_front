import { Modal } from "antd";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import WarehouseForm from "@/components/forms/WarehouseForm";
import {
  useLazyWarehouseByIdApiQuery,
  useUpdateWarehouseMutation,
} from "@/app/services/warehouses/warehousesApi";

type Props = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  name: string;
  id: string;
  modalType: "UPDATE" | "ADD";
  loading: boolean;
  query: {
    id: string;
    page: number;
    limit: number;
  };
};

const schema = z.object({
  name: z
    .string()
    .nonempty("Обязательное поле")
    .min(5, "Минимальная длина - 5")
    .max(20, "Максимальная длина - 20"),
});

type FormValues = z.infer<typeof schema>;

const UpdateWarehouse: React.FC<Props> = ({
  isOpen,
  setOpen,
  id,
  modalType,
  name,
  loading,
  query,
}) => {
  const {
    handleSubmit,
    control,
    formState: { isDirty, errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  const { callMessage } = useUiContext();
  const [updateWarehouse] = useUpdateWarehouseMutation();
  const [triggerWarehouse] = useLazyWarehouseByIdApiQuery();

  const onCancel = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const nameResult =
        data.name !== name && data.name?.length ? data.name : undefined;

      if (nameResult) {
        const { message } = await updateWarehouse({
          name: nameResult,
          id,
        }).unwrap();
        await triggerWarehouse(query).unwrap();
        callMessage.success(message);
      }
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
    }
  };

  useEffect(() => {
    reset({ name });
  }, [name, reset]);

  return (
    modalType === "UPDATE" && (
      <Modal
        title="Редактировать данные"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpen}
        footer={null}
        onCancel={onCancel}
        loading={loading}
      >
        <WarehouseForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          control={control}
          isSubmitting={isSubmitting}
          isDirty={isDirty}
          onCancel={onCancel}
          text="Сохранить"
        />
      </Modal>
    )
  );
};

export default UpdateWarehouse;
