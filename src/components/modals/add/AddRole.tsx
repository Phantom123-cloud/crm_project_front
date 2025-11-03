import { Modal } from "antd";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useCreateRoleMutation,
  useLazyAllRoleQuery,
} from "@/app/services/roles/rolesApi";
import type { TSelect } from "@/types";
import RoleForm from "@/components/forms/RoleForm";

type Props = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  limit: number;
  page: number;
  roleTypes: TSelect[];
};

const schema = z.object({
  name: z
    .string()
    .nonempty("Обязательное поле")
    .min(5, "Минимальная длина - 5")
    .max(20, "Максимальная длина - 20"),
  descriptions: z
    .string()
    .nonempty("Обязательное поле")
    .min(5, "Минимальная длина - 5")
    .max(35, "Максимальная длина - 35"),
  roleTypeId: z.string().nonempty("Обязательное поле"),
});

type FormValues = z.infer<typeof schema>;

const AddRole: React.FC<Props> = ({
  isOpen,
  setOpen,
  limit,
  page,
  roleTypes,
}) => {
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
      roleTypeId: "",
    },
  });

  const { callMessage } = useUiContext();
  const [createRole] = useCreateRoleMutation();
  const [triggerRole] = useLazyAllRoleQuery();

  const onCancel = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await createRole(data).unwrap();
      await triggerRole({ limit, page }).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
    }
  };

  return (
    <Modal
      title="Добавить новую роль"
      closable={{ "aria-label": "Custom Close Button" }}
      open={isOpen}
      footer={null}
      onCancel={onCancel}
    >
      <RoleForm
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        control={control}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        text={"Добавить"}
        roleTypes={roleTypes}
        required={true}
      />
    </Modal>
  );
};

export default AddRole;
