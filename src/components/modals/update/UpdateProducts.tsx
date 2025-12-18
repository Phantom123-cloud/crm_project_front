import { Button, Modal } from "antd";
import { useEffect, type SetStateAction } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useLazyAllProductsQuery,
  useUpdateProductMutation,
} from "@/app/services/products/productsApi";
import ProductsForm from "@/components/forms/ProductsForm";
import { EditOutlined } from "@ant-design/icons";
import { useOnModal } from "@/hooks/useOnModal";

type Props = {
  item: {
    id: string;
    name: string;
  };
  loading: boolean;
  page: number;
  limit: number;
};

const schema = z.object({
  name: z
    .string()
    .nonempty("Обязательное поле")
    .min(5, "Минимальная длина - 5")
    .max(20, "Максимальная длина - 20"),
});

type FormValues = z.infer<typeof schema>;

const UpdateProducts: React.FC<Props> = ({ item, loading, page, limit }) => {
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

  const { onOpen, onCancel, isOpen } = useOnModal();
  const { callMessage } = useUiContext();
  const [updateProduct] = useUpdateProductMutation();
  const [triggerProduct] = useLazyAllProductsQuery();

  const onSubmit = async (data: FormValues) => {
    try {
      const nameResult =
        data.name !== item.name && data.name?.length ? data.name : undefined;

      if (nameResult) {
        const { message } = await updateProduct({
          name: nameResult,
          id: item.id,
        }).unwrap();
        await triggerProduct({ page, limit }).unwrap();
        callMessage.success(message);
      }
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
      reset();
    }
  };

  useEffect(() => {
    reset({ name: item.name });
  }, [item.name, reset]);

  return (
    <>
      <Button
        color="primary"
        variant="outlined"
        icon={<EditOutlined />}
        onClick={onOpen}
        size="small"
      >
        изменить
      </Button>
      <Modal
        title="Редактировать данные"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpen}
        footer={null}
        onCancel={onCancel}
        loading={loading}
      >
        <ProductsForm
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

export default UpdateProducts;
