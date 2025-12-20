import { Button, Modal } from "antd";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import TripTypeForm from "@/components/forms/TripTypeForm";
import {
  useCreateTripTypesMutation,
  useLazyAllTripTypesQuery,
} from "@/app/services/trip-types/tripTypesApi";
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

const AddTripType: React.FC<Props> = ({ page, limit }) => {
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
  const [createTripType] = useCreateTripTypesMutation();
  const [triggerTripTypes] = useLazyAllTripTypesQuery();
  const { onOpen, onCancel, isOpen } = useOnModal();

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await createTripType(data).unwrap();
      await triggerTripTypes({ page, limit }).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      reset();
      onCancel();
    }
  };

  return (
    <>
      <div className="flex justify-end mb-10">
        <Button
          color="green"
          variant="outlined"
          icon={<PlusOutlined />}
          onClick={onOpen}
        >
          Добавить
        </Button>
      </div>
      <Modal
        title="Добавить новый тип роли"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpen}
        footer={null}
        onCancel={onCancel}
      >
        <TripTypeForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          control={control}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
          text="Добавить"
          required
        />
      </Modal>
    </>
  );
};

export default AddTripType;
