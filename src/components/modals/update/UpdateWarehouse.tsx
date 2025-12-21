import { Modal } from "antd";
import { useEffect, useState } from "react";
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
import { EditOutlined } from "@ant-design/icons";

type Props = {
  name: string;
  id: string;
  loading: boolean;
  queryStockMove: {
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

const UpdateWarehouse: React.FC<Props> = ({ id, name, loading, queryStockMove }) => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCancel = () => {
    setIsModalOpen(false);
    reset();
  };

  const showModal = () => {
    setIsModalOpen(true);
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
        await triggerWarehouse(queryStockMove).unwrap();
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
    <>
      <EditOutlined onClick={showModal} />
      <Modal
        title="Редактировать данные"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
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
    </>
  );
};

export default UpdateWarehouse;
