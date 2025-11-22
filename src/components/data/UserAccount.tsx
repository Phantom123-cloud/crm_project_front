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

const schema = z.object({
  oldPassword: z.optional(z.string()),
  newPassword: z.optional(z.string()),
  email: z.string(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  email: string;
  userId: string;
};

const UserAccount: React.FC<Props> = ({ email, userId }) => {
  const [updateAccount] = useUpdateAccountCredentialsMutation();
  const [triggerUserData] = useLazyUserByIdQuery();
  const { callMessage } = useUiContext();

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
  const onOpen = () => setIsOpen(true);

  return (
    <RolesGuard access={"update_accounts"}>
      <div className="flex justify-end">
        <Button onClick={onOpen} type="primary">
          Редактировать роли
        </Button>
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

      <UpdateRolesByUserId
        userId={userId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </RolesGuard>
  );
};

export default UserAccount;
