import { Modal } from "antd";
import { useEffect, type SetStateAction } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import {
  useLazyAllRolesTypeQuery,
  useUpdateRolesTypeMutation,
} from "@/app/services/role-types/roleTypesApi";
import { errorMessages } from "@/utils/is-error-message";
import RoleTypeForm from "@/components/forms/RoleTypeForm";

type Props = {
  isOpen: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
  name: string;
  descriptions: string;
  id: string;
  modalType: "UPDATE" | "DELETE";
  loading: boolean;
  page: number;
  limit: number;
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

const UpdateRoleType: React.FC<Props> = ({
  isOpen,
  setOpen,
  id,
  name,
  modalType,
  descriptions,
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
      descriptions,
    },
    mode: "onChange",
  });

  const { callMessage } = useUiContext();
  const [updateTypeRole] = useUpdateRolesTypeMutation();
  const [triggerRoleTypes] = useLazyAllRolesTypeQuery();

  const onCancel = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const resultData = {
        name: data.name !== name && data.name?.length ? data.name : undefined,
        descriptions:
          data.descriptions !== descriptions && data.descriptions?.length
            ? data.descriptions
            : undefined,
      };
      const { message } = await updateTypeRole({ ...resultData, id }).unwrap();
      await triggerRoleTypes({ page, limit }).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
    }
  };

  useEffect(() => {
    reset({ name, descriptions });
  }, [name, descriptions, reset]);

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
        <RoleTypeForm
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
    )
  );
};

export default UpdateRoleType;
