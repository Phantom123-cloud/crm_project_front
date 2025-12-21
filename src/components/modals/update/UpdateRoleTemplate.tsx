import { Button, Flex, Form, Input, Modal, Tabs } from "antd";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useLazyAllRoleTemplatesByIdQuery,
  useLazyAllRoleTemplatesQuery,
  useUpdateRoleTemplateMutation,
} from "@/app/services/role-templates/roleTemplatesApi";
import type { RolesObj } from "@/app/services/role-templates/roleTemplatesTypes";
import { useLazyGetRolesNotInTemplateQuery } from "@/app/services/roles/rolesApi";
import RolesGuard from "@/components/layout/RolesGuard";
import { EditOutlined } from "@ant-design/icons";
import { useOnModal } from "@/hooks/useOnModal";
import CheckboxRolesGroupContoller from "@/components/UI/checkboxes/CheckboxRolesGroupContoller";

type Props = {
  name: string;
  id: string;
  loading: boolean;
  page: number;
  limit: number;
};

const schema = z.object({
  name: z
    .string()
    .nonempty("Обязательное поле")
    .min(5, "Минимальная длина - 5")
    .max(20, "Максимальная длина - 20"),
  arrayConnect: z.array(z.string()),
  arrayDisconnect: z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;

const UpdateRoleTemplate: React.FC<Props> = ({
  id,
  name,
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
      arrayConnect: [],
      arrayDisconnect: [],
    },
    mode: "onChange",
  });

  const { callMessage } = useUiContext();
  const [triggerRoleTemp, { data }] = useLazyAllRoleTemplatesByIdQuery();
  const [updateRoleTemplate] = useUpdateRoleTemplateMutation();
  const [triggerRoleTemplates] = useLazyAllRoleTemplatesQuery();
  const [triggerRolesNotInTemplate, { data: unusedRoles }] =
    useLazyGetRolesNotInTemplateQuery();

  const [key, setKey] = useState<"connect" | "disconnect">("disconnect");

  const { onOpen, onCancel, isOpen } = useOnModal();

  const usedRoles = data?.data?.roles ?? [];

  const tabItems: {
    array: (RolesObj | undefined)[];
    name: "arrayConnect" | "arrayDisconnect";
    label: string;
    key: "connect" | "disconnect";
  }[] = [
    {
      array: usedRoles,
      name: "arrayDisconnect",
      label: "Удалить роль",
      key: "disconnect",
    },
    {
      array: unusedRoles?.data?.roles ?? [],
      name: "arrayConnect",
      label: "Добавить роль",
      key: "connect",
    },
  ];

  useEffect(() => {
    if (key === "connect") {
      triggerRolesNotInTemplate(id);
    }
    if (isOpen) {
      triggerRoleTemp(id);
    }
  }, [key, isOpen]);

  const onSubmit = async (data: FormValues) => {
    try {
      const resultData = {
        name: data.name !== name && data.name?.length ? data.name : undefined,
        arrayConnect: data.arrayConnect?.length ? data.arrayConnect : undefined,
        arrayDisconnect: data.arrayDisconnect?.length
          ? data.arrayDisconnect
          : undefined,
      };

      const { message } = await updateRoleTemplate({
        ...resultData,
        id,
      }).unwrap();
      await triggerRoleTemplates({ page, limit }).unwrap();
      await triggerRoleTemp(id).unwrap();
      await triggerRolesNotInTemplate(id).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
      reset();
    }
  };

  useEffect(() => {
    reset({ name });
  }, [name, reset]);

  return (
    <RolesGuard access={"update_templates"}>
      <Button
        color="primary"
        variant="outlined"
        icon={<EditOutlined />}
        onClick={onOpen}
        size="small"
      >
        изменить
      </Button>
      <Modal
        title="Редактировать данные"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpen}
        footer={null}
        onCancel={onCancel}
        loading={loading}
      >
        <Form onFinish={handleSubmit(onSubmit)} autoComplete="off">
          <Form.Item
            label="Имя"
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Tabs
            defaultActiveKey="disconnect"
            onChange={(key) => setKey(key as "disconnect" | "connect")}
            items={tabItems.map((item) => {
              return {
                key: item.key,
                label: item.label,
                forceRender: true,
                children: (
                  <Form.Item className="max-h-[700px] overflow-auto">
                    <CheckboxRolesGroupContoller
                      name={item.name}
                      control={control}
                      roles={item?.array as RolesObj[]}
                    />
                  </Form.Item>
                ),
              };
            })}
          />

          <Flex justify="space-between">
            <Form.Item label={null}>
              <Button
                variant="solid"
                color="blue"
                htmlType="submit"
                loading={isSubmitting}
                disabled={!isDirty}
              >
                Сохранить
              </Button>
            </Form.Item>

            <Button variant="solid" color="default" onClick={onCancel}>
              Закрыть
            </Button>
          </Flex>
        </Form>
      </Modal>
    </RolesGuard>
  );
};

export default UpdateRoleTemplate;
