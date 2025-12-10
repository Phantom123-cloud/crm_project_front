import { array, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import { Button, Flex, Form, Input, Modal, Select } from "antd";
import {
  useLazyAllRoleTemplatesByIdQuery,
  useLazyAllRoleTemplatesSelectQuery,
} from "@/app/services/role-templates/roleTemplatesApi";
import { useEffect, useState } from "react";
import CheckboxRolesGroupContoller from "@/components/CheckboxRolesGroupContoller";
import { useRegisterMutation } from "@/app/services/auth/authApi";
import { useLazyGetRolesNotInTemplateQuery } from "@/app/services/roles/rolesApi";
import RolesGuard from "@/components/layout/RolesGuard";

const schema = z.object({
  email: z.email("Некоректный email"),

  password: z
    .string()
    .nonempty("Обязательное поле")
    .min(5, "Минимальная длина - 5")
    .max(20, "Максимальная длина - 20"),

  roleTemplatesId: z.string().nonempty("Обязательное поле"),
  arrayBlockedRoles: array(z.string()).optional(),
  arrayAddRoles: array(z.string()).optional(),
});

type FormValues = z.infer<typeof schema>;

const RegisterUsers = () => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      email: "",
      roleTemplatesId: "",
      arrayBlockedRoles: [],
      arrayAddRoles: [],
    },
  });

  const [triggerRoleTemplatesSelect, { data: templatesSelect, isLoading }] =
    useLazyAllRoleTemplatesSelectQuery();
  const [
    triggerRoleTemplatesUsed,
    { data: usedRoles, isLoading: isLoadRoles },
  ] = useLazyAllRoleTemplatesByIdQuery();
  const [
    triggerRolesNotInTemplate,
    { data: unsedRoles, isLoading: isLoadUnsedRoles },
  ] = useLazyGetRolesNotInTemplateQuery();

  const [rolesByTemplateId, setRolesByTemplateId] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenSelect, setIsOpenSelect] = useState(false);

  const [showButtonRules, setShowButtonRules] = useState(false);
  const [typeModal, setTypeModal] = useState<"ADD" | "DELETE" | null>(null);
  const onCancel = () => {
    setIsModalOpen(false);
    setTypeModal(null);
  };
  const showModal = (type: "ADD" | "DELETE") => {
    setIsModalOpen(true);
    setTypeModal(type);
  };
  const onTemplateIdChange = (value: string) => {
    setRolesByTemplateId(value);
  };

  const getRolesByTemplateId = async (id: string) => {
    try {
      if (id) {
        const { success } = await triggerRoleTemplatesUsed(id).unwrap();
        await triggerRolesNotInTemplate(id).unwrap();
        setShowButtonRules(success);
      }
    } catch (err) {
      callMessage.error(errorMessages(err));
    }
  };

  const { callMessage } = useUiContext();
  const [registerUser] = useRegisterMutation();

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await registerUser(data).unwrap();
      callMessage.success(message);
      setRolesByTemplateId(null);
      setShowButtonRules(false);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      reset();
    }
  };

  const roleTemplates = (templatesSelect?.data?.templates ?? []).map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  useEffect(() => {
    if (isOpenSelect) {
      console.log(templatesSelect);

      triggerRoleTemplatesSelect();
    }
  }, [isOpenSelect]);

  useEffect(() => {
    if (rolesByTemplateId) {
      getRolesByTemplateId(rolesByTemplateId);
    }
  }, [rolesByTemplateId]);

  return (
    <RolesGuard access={"register_users"}>
      <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
          required
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input type="email" {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Пароль"
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}
          required
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => <Input.Password {...field} />}
          />
        </Form.Item>

        <Form.Item
          label="Тип роли"
          validateStatus={errors.roleTemplatesId ? "error" : ""}
          help={errors.roleTemplatesId?.message}
          required
        >
          <Flex wrap gap={10}>
            <Controller
              name="roleTemplatesId"
              control={control}
              render={({ field }) => (
                <Select
                  loading={isLoading}
                  onOpenChange={(isOpen) => setIsOpenSelect(isOpen)}
                  {...field}
                  showSearch
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={roleTemplates}
                  onChange={(value) => {
                    onTemplateIdChange(value);
                    field.onChange(value);
                  }}
                />
              )}
            />

            {showButtonRules && (
              <Flex gap="small" wrap>
                <Button
                  color="cyan"
                  variant="solid"
                  onClick={() => showModal("ADD")}
                >
                  расширить права
                </Button>
                <Button
                  color="danger"
                  variant="solid"
                  onClick={() => showModal("DELETE")}
                >
                  ограничить права
                </Button>
              </Flex>
            )}
          </Flex>
        </Form.Item>

        <Flex justify="flex-end">
          <Form.Item label={null}>
            <Button
              variant="solid"
              color="blue"
              htmlType="submit"
              loading={isSubmitting}
              disabled={!isDirty}
            >
              Зарегистрировать
            </Button>
          </Form.Item>
        </Flex>

        {isModalOpen && (
          <Modal
            title={
              typeModal === "DELETE"
                ? "Выберите права для ограничения"
                : "Добавить новые права"
            }
            closable={{ "aria-label": "Custom Close Button" }}
            open={isModalOpen}
            footer={null}
            onCancel={onCancel}
            loading={typeModal === "DELETE" ? isLoadRoles : isLoadUnsedRoles}
          >
            <Form.Item label={null} className="max-h-[700px] overflow-auto">
              <CheckboxRolesGroupContoller
                name={
                  typeModal === "DELETE" ? "arrayBlockedRoles" : "arrayAddRoles"
                }
                control={control}
                roles={
                  typeModal === "DELETE"
                    ? usedRoles?.data?.roles ?? []
                    : unsedRoles?.data?.roles ?? []
                }
              />

              {typeModal === "DELETE" &&
              (usedRoles?.data?.roles ?? []).length === 0
                ? "Шаблон не содержит ролей"
                : typeModal === "ADD" &&
                  (unsedRoles?.data?.roles ?? []).length === 0
                ? "В шаблоне уже все права"
                : ""}
            </Form.Item>
          </Modal>
        )}
      </Form>
    </RolesGuard>
  );
};

export default RegisterUsers;
