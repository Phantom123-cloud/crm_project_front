import { useLazyUserByIdQuery } from "@/app/services/users/usersApi";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { useUpdateAccountCredentialsMutation } from "@/app/services/auth/authApi";
import UpdateRolesByUserId from "../modals/update/UpdateRolesByUserId";
import RolesGuard from "../layout/RolesGuard";
import UpdateRolesTemplate from "../modals/update/UpdateRolesTemplate";

const schema = z.object({
  oldPassword: z.optional(z.string()),
  newPassword: z.optional(z.string()),
  email: z.string(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  email: string;
  userId: string;
  roleTemplatesId: string;
};

const UserAccount: React.FC<Props> = ({ email, userId, roleTemplatesId }) => {
  const [updateAccount] = useUpdateAccountCredentialsMutation();
  const [triggerUserData] = useLazyUserByIdQuery();
  const { callMessage } = useUiContext();
  const [modalType, setModalType] = useState<"roles" | "templates">("roles");

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (email) {
      reset({
        email: email ?? "",
      });
    }
  }, [email, reset]);

  const onSubmit = async (data: Partial<FormValues>) => {
    try {
      const { oldPassword, newPassword } = data;

      const { message } = await updateAccount({
        oldPassword,
        newPassword,
        email: data.email !== email ? data.email : undefined,
        userId,
      }).unwrap();
      await triggerUserData(userId).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      reset();
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = (modalType: "roles" | "templates") => {
    setModalType(modalType);
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <RolesGuard access={"update_account_roles"}>
          <Button onClick={() => onOpen("roles")} type="primary">
            Редактировать роли
          </Button>
        </RolesGuard>
        <RolesGuard access={"update_roles_template"}>
          <Button
            color="danger"
            variant="solid"
            onClick={() => onOpen("templates")}
          >
            Сменить шаблон
          </Button>
        </RolesGuard>
      </div>

      <Form
        name="basic"
        onFinish={handleSubmit(onSubmit)}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Email"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input type="email" {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Текущий пароль"
          validateStatus={errors.oldPassword ? "error" : ""}
          help={errors.oldPassword?.message}
        >
          <Controller
            name="oldPassword"
            control={control}
            render={({ field }) => <Input.Password {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Новый пароль"
          validateStatus={errors.newPassword ? "error" : ""}
          help={errors.newPassword?.message}
        >
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => <Input.Password {...field} />}
          />
        </Form.Item>
        <Form.Item label={null}>
          <Button
            variant="solid"
            color="blue"
            htmlType="submit"
            loading={isSubmitting}
            disabled={!isDirty}
          >
            Обновить данные
          </Button>
        </Form.Item>
      </Form>

      {modalType === "roles" && (
        <UpdateRolesByUserId
          userId={userId}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
      {modalType === "templates" && (
        <UpdateRolesTemplate
          userId={userId}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          roleTemplatesId={roleTemplatesId}
        />
      )}
    </>
  );
};

export default UserAccount;
