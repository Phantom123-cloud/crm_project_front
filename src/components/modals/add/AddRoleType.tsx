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
import RoleTypeForm from "@/components/forms/RoleTypeForm";

type Props = {
  isOpen: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
};

const schema = z.object({
  name: z
    .string()
    .nonempty("Обязательное поле")
    .min(4, "Минимальная длина - 4")
    .max(20, "Максимальная длина - 20"),
  descriptions: z
    .string()
    .nonempty("Обязательное поле")
    .min(5, "Минимальная длина - 5")
    .max(35, "Максимальная длина - 35"),
});

type FormValues = z.infer<typeof schema>;

const AddRoleType: React.FC<Props> = ({ isOpen, setOpen }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      descriptions: "",
    },
  });

  const { callMessage } = useUiContext();
  const [createRoleType] = useCreateRolesTypeMutation();
  const [triggerRoleTypes] = useLazyAllRolesTypeQuery();

  const onCancel = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await createRoleType(data).unwrap();
      await triggerRoleTypes().unwrap();
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
      <RoleTypeForm
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        control={control}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        text="Добавить"
        required={true}
      />
    </Modal>
  );
};

export default AddRoleType;
