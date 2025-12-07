import { Modal } from "antd";
import type { SetStateAction } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import ProductsForm from "@/components/forms/ProductsForm";
import { useCreateProductMutation, useLazyAllProductsQuery } from "@/app/services/products/productsApi";


type Props = {
  isOpen: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
};

const schema = z.object({
  name: z
    .string()
    .nonempty("Обязательное поле")
    .min(5, "Минимальная длина - 5")
    .max(20, "Максимальная длина - 20"),
});

type FormValues = z.infer<typeof schema>;

const AddProducts: React.FC<Props> = ({ isOpen, setOpen }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
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

  const onCancel = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await createProduct(data).unwrap();
      await triggerProducts().unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
    }
  };

  return (
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
        text="Сохранить"
      />
    </Modal>
  );
};

export default AddProducts;
