import { Button, Modal } from "antd";
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
import RolesGuard from "@/components/layout/RolesGuard";
import { PlusOutlined } from "@ant-design/icons";
import { useOnModal } from "@/hooks/useOnModal";

type Props = {
  page: number;
  limit: number;
};

const schema = z.object({
  name: z
    .string()
    .nonempty("Обязательное поле")
    .min(4, "Минимальная длина - 4")
    .max(30, "Максимальная длина - 30"),
  descriptions: z
    .string()
    .nonempty("Обязательное поле")
    .min(5, "Минимальная длина - 5")
    .max(35, "Максимальная длина - 35"),
});

type FormValues = z.infer<typeof schema>;

const AddRoleType: React.FC<Props> = ({ page, limit }) => {
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

  const { onOpen, onCancel, isOpen } = useOnModal();

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await createRoleType(data).unwrap();
      await triggerRoleTypes({ page, limit }).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
      reset();
    }
  };

  return (
    <RolesGuard access={"create_role_types"}>
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
        <RoleTypeForm
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
    </RolesGuard>
  );
};

export default AddRoleType;
