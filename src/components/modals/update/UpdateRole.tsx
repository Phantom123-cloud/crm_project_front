import { Modal } from "antd";
import { useEffect, type SetStateAction } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useLazyAllRoleQuery,
  useUpdateRoleMutation,
} from "@/app/services/roles/rolesApi";
import type { TModal } from "@/types";
import RoleForm from "@/components/forms/RoleForm";
import { useLazyAllRolesTypeQuery } from "@/app/services/role-types/roleTypesApi";

type Props = {
  isOpen: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
  name: string;
  descriptions: string;
  id: string;
  roleTypeId: string;
  modalType: TModal;
  limit: number;
  page: number;
  loading: boolean;
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
  roleTypeId: z.string(),
});

type FormValues = z.infer<typeof schema>;

const UpdateRole: React.FC<Props> = ({
  isOpen,
  setOpen,
  id,
  name,
  modalType,
  descriptions,
  roleTypeId,
  limit,
  page,
  loading,
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
      descriptions,
      roleTypeId,
    },
    mode: "onChange",
  });

  const { callMessage } = useUiContext();
  const [updateRole] = useUpdateRoleMutation();
  const [triggerRole] = useLazyAllRoleQuery();
  const [triggerData, { data }] = useLazyAllRolesTypeQuery();

  const onCancel = () => {
    setOpen(false);
    reset();
  };

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
      const resultData = {
        name: data.name !== name && data.name?.length ? data.name : undefined,
        descriptions:
          data.descriptions !== descriptions && data.descriptions?.length
            ? data.descriptions
            : undefined,
        roleTypeId:
          data.roleTypeId !== roleTypeId && data.roleTypeId?.length
            ? data.roleTypeId
            : undefined,
      };

      const { message } = await updateRole({ ...resultData, id }).unwrap();
      await triggerRole({ limit, page }).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
    }
  };

  useEffect(() => {
    reset({ name, descriptions, roleTypeId });
  }, [name, descriptions, roleTypeId, reset]);

  return (
    modalType === "UPDATE" && (
      <Modal
        title="Редактировать данные"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpen}
        footer={null}
        onCancel={onCancel}
        loading={loading}
      >
        <RoleForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          control={control}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
          text={"Сохранить"}
          roleTypes={roleTypes}
          isDirty={isDirty}
        />
      </Modal>
    )
  );
};

export default UpdateRole;
