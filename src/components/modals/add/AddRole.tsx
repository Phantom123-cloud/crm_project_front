import { Button, Modal } from "antd";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useCreateRoleMutation,
  useLazyAllRoleQuery,
} from "@/app/services/roles/rolesApi";
import RoleForm from "@/components/forms/RoleForm";
import { useOnModal } from "@/hooks/useOnModal";
import { PlusOutlined } from "@ant-design/icons";
import { useLazyAllSelectRolesTypeQuery } from "@/app/services/role-types/roleTypesApi";
import { useEffect } from "react";
import RolesGuard from "@/components/layout/RolesGuard";

type Props = {
  limit: number;
  page: number;
};

const schema = z.object({
  name: z
    .string()
    .nonempty("Обязательное поле")
    .min(5, "Минимальная длина - 5")
    .max(30, "Максимальная длина - 30"),
  descriptions: z
    .string()
    .nonempty("Обязательное поле")
    .min(5, "Минимальная длина - 5")
    .max(35, "Максимальная длина - 35"),
  roleTypeId: z.string().nonempty("Обязательное поле"),
});

type FormValues = z.infer<typeof schema>;

const AddRole: React.FC<Props> = ({ limit, page }) => {
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
  const { onOpen, onCancel, isOpen } = useOnModal();
  const [triggerData, { data, isLoading }] = useLazyAllSelectRolesTypeQuery();

  const roleTypes = (data?.data ?? []).map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  useEffect(() => {
    if (isOpen) {
      triggerData();
    }
  }, [isOpen]);

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await createRole(data).unwrap();
      await triggerRole({ limit, page }).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
      reset();
    }
  };

  return (
    <RolesGuard access={"create_roles"}>
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
          title="Добавить новую роль"
          closable={{ "aria-label": "Custom Close Button" }}
          open={isOpen}
          footer={null}
          onCancel={onCancel}
          loading={isLoading}
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
      </div>
    </RolesGuard>
  );
};

export default AddRole;
