import { Button, Flex, Form, Input, Modal, Tabs } from "antd";
import { useEffect, useState, type SetStateAction } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useAllRoleTemplatesByIdQuery,
  useLazyAllRoleTemplatesQuery,
  useLazyGetRolesNotInTemplateQuery,
  useUpdateRoleTemplateMutation,
} from "@/app/services/role-templates/roleTemplatesApi";
import type { RolesObj } from "@/app/services/role-templates/roleTemplatesTypes";
import RolesCheckboxGroup from "@/components/RolesCheckboxGroup";
import CheckboxRolesGroupContoller from "@/components/CheckboxRolesGroupContoller";

type Props = {
  isOpen: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
  name: string;
  id: string;
  modalType: "UPDATE" | "DELETE";
  roleTypes: {
    value: string;
    label: string;
  }[];
  roles: RolesObj[];
  loading: boolean;
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
  isOpen,
  setOpen,
  id,
  name,
  modalType,
  roles,
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
      arrayConnect: [],
      arrayDisconnect: [],
    },
    mode: "onChange",
  });

  const { callMessage } = useUiContext();
  const { data } = useAllRoleTemplatesByIdQuery(id);
  const [updateRoleTemplate] = useUpdateRoleTemplateMutation();
  const [triggerRoleTemplate] = useLazyAllRoleTemplatesQuery();
  const [triggerRolesNotInTemplate, { data: unusedRoles }] =
    useLazyGetRolesNotInTemplateQuery();

  const [key, setKey] = useState<"connect" | "disconnect">("disconnect");

  const onCancel = () => {
    setOpen(false);
    reset();
  };

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
  }, [key]);

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
      await triggerRoleTemplate().unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
    }
  };

  useEffect(() => {
    reset({ name });
  }, [name, reset]);

  return (
    modalType === "UPDATE" && (
      <Modal
        title="Изменить имя для типа роли"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpen}
        footer={null}
        onCancel={onCancel}
        width={600}
        loading={loading}
      >
        <Form name="basic" onFinish={handleSubmit(onSubmit)} autoComplete="off">
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
                  <Form.Item>
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
    )
  );
};

export default UpdateRoleTemplate;
