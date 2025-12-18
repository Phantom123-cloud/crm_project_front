import { Button, Modal } from "antd";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import ProductsForm from "@/components/forms/ProductsForm";
import {
  useCreateProductMutation,
  useLazyAllProductsQuery,
} from "@/app/services/products/productsApi";
import { useOnModal } from "@/hooks/useOnModal";
import { PlusOutlined } from "@ant-design/icons";

type Props = {
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

const AddProducts: React.FC<Props> = ({ page, limit }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const { callMessage } = useUiContext();
  const [createProduct] = useCreateProductMutation();
  const [triggerProducts] = useLazyAllProductsQuery();
  const { onOpen, onCancel, isOpen } = useOnModal();

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await createProduct(data).unwrap();
      await triggerProducts({ page, limit }).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
      reset();
    }
  };

  return (
    <div className="flex justify-end mb-10">
      <Button
        color="green"
        variant="outlined"
        icon={<PlusOutlined />}
        onClick={onOpen}
      >
        Добавить
      </Button>
      <Modal
        title="Добавить новый продукт"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpen}
        footer={null}
        onCancel={onCancel}
      >
        <ProductsForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          control={control}
          isSubmitting={isSubmitting}
          required
          onCancel={onCancel}
          isDirty={isDirty}
          text="Сохранить"
        />
      </Modal>
    </div>
  );
};

export default AddProducts;
