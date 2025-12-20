import { Button, Modal } from "antd";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import TripTypeForm from "@/components/forms/TripTypeForm";
import {
  useUpdateTripTypesMutation,
  useLazyAllTripTypesQuery,
} from "@/app/services/trip-types/tripTypesApi";
import { useOnModal } from "@/hooks/useOnModal";
import { EditOutlined } from "@ant-design/icons";

type Props = {
  name: string;
  id: string;
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

const UpdateTripType: React.FC<Props> = ({
  id,
  name,
  loading,
  page,
  limit,
}) => {
  const {
    handleSubmit,
    control,
    formState: { isDirty, errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name,
    },
    mode: "onChange",
  });

  const { callMessage } = useUiContext();
  const [updateTypeTrip] = useUpdateTripTypesMutation();
  const [triggerTripTypes] = useLazyAllTripTypesQuery();

  const { onOpen, onCancel, isOpen } = useOnModal();

  const onSubmit = async (data: FormValues) => {
    try {
      const resultData = {
        name: data.name !== name && data.name?.length ? data.name : undefined,
      };
      const { message } = await updateTypeTrip({ ...resultData, id }).unwrap();
      await triggerTripTypes({ page, limit }).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
      reset();
    }
  };

  useEffect(() => {
    reset({ name });
  }, [name, reset]);

  return (
    <>
      <Button
        color="primary"
        size="small"
        variant="outlined"
        icon={<EditOutlined />}
        onClick={onOpen}
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
        <TripTypeForm
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

export default UpdateTripType;
