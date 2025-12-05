import { Modal } from "antd";
import type { SetStateAction } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import {
  useCreateRolesTypeMutation,
  useLazyAllRolesTypeQuery,
} from "@/app/services/role-types/roleTypesApi";
import { errorMessages } from "@/utils/is-error-message";
import TripTypeForm from "@/components/forms/TripTypeForm";
import {
  useCreateTripTypesMutation,
  useLazyAllTripTypesQuery,
} from "@/app/services/trip-types/tripTypesApi";

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

const AddTripType: React.FC<Props> = ({ isOpen, setOpen }) => {
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

  const onCancel = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await createTripType(data).unwrap();
      await triggerTripTypes().unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
    }
  };

  return (
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
  );
};

export default AddTripType;
