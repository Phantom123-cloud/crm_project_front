import { Button, Flex, Form, Modal, Select } from "antd";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useChangeRoleTemplateMutation,
  useLazyUserByIdQuery,
} from "@/app/services/users/usersApi";
import { useAllRoleTemplatesQuery } from "@/app/services/role-templates/roleTemplatesApi";
import Title from "antd/es/typography/Title";

type Props = {
  userId: string;
  isOpen: boolean;
  roleTemplatesId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const schema = z.object({
  roleTemplatesId: z.string(),
});

type FormValues = z.infer<typeof schema>;

const UpdateRolesTemplate: React.FC<Props> = ({
  userId,
  isOpen,
  setIsOpen,
  roleTemplatesId,
}) => {
  const {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitting, errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      roleTemplatesId: "",
    },
    mode: "onChange",
  });

  const { data, isLoading } = useAllRoleTemplatesQuery();
  const [updateRoleTemplate] = useChangeRoleTemplateMutation();
  const [triggerUserData] = useLazyUserByIdQuery();
  const { callMessage } = useUiContext();

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await updateRoleTemplate({
        ...data,
        userId,
      }).unwrap();
      await triggerUserData(userId).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
    }
  };

  const onCancel = () => {
    setIsOpen(false);
    reset();
  };

  useEffect(() => {
    if (isOpen) {
      reset({ roleTemplatesId });
    }
  }, [isOpen]);

  return (
    <Modal
      title="Смена шаблона"
      closable={{ "aria-label": "Custom Close Button" }}
      open={isOpen}
      footer={null}
      onCancel={onCancel}
      width={700}
      loading={isLoading}
    >
      <Title level={3} type="danger">
        При смене шаблона текущие индивидуальные настройки прав доступа будут
        удалены
      </Title>

      <Form onFinish={handleSubmit(onSubmit)} autoComplete="off">
        <Form.Item
          label={"Шаблон"}
          validateStatus={errors.roleTemplatesId ? "error" : ""}
          help={errors.roleTemplatesId?.message}
        >
          <Controller
            name="roleTemplatesId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={data?.data?.templates.map((temlate) => ({
                  value: temlate.id,
                  label: temlate.name,
                }))}
              />
            )}
          />
        </Form.Item>

        <Flex justify="space-between">
          <Button
            variant="solid"
            color="blue"
            htmlType="submit"
            loading={isSubmitting}
            disabled={!isDirty}
          >
            Сохранить
          </Button>
          <Button variant="solid" color="default" onClick={onCancel}>
            Закрыть
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

export default UpdateRolesTemplate;
