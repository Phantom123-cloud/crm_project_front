import { Button, Checkbox, Divider, Flex, Form, Input, Modal } from "antd";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useCreateRoleTemplateMutation,
  useLazyAllRoleTemplatesQuery,
} from "@/app/services/role-templates/roleTemplatesApi";
import type { RolesAddObj } from "@/app/services/role-templates/roleTemplatesTypes";
import CheckboxGroup from "@/components/CheckboxGroup";

type Props = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  roles: RolesAddObj[];
};
const schema = z.object({
  name: z
    .string()
    .nonempty("Обязательное поле")
    .min(5, "Минимальная длина - 5")
    .max(20, "Максимальная длина - 20"),
  array: z.array(z.string()).min(1, "Минимальная длина - 1"),
});

type FormValues = z.infer<typeof schema>;

const AddRoleTemplate: React.FC<Props> = ({ isOpen, setOpen, roles }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      array: [],
    },
  });

  const { callMessage } = useUiContext();

  const [createRoleTemplate] = useCreateRoleTemplateMutation();
  const [triggerRoleTemplates] = useLazyAllRoleTemplatesQuery();

  const onCancel = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await createRoleTemplate(data).unwrap();
      await triggerRoleTemplates().unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
    }
  };
  return (
    <Modal
      title="Добавить новый шаблон"
      closable={{ "aria-label": "Custom Close Button" }}
      open={isOpen}
      footer={null}
      onCancel={onCancel}
    >
      <Form name="basic" onFinish={handleSubmit(onSubmit)} autoComplete="off">
        <Form.Item
          label="Имя"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
          required={true}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          validateStatus={errors.array ? "error" : ""}
          help={errors.array?.message}
          required={true}
        >
          <Controller
            name="array"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <div className="grid gap-5">
                {roles.map((type) => {
                  const roleIds = type.roles.map((r) => r.id);

                  const selected = field.value.filter((v: string) =>
                    roleIds.includes(v)
                  );
                  const isAllChecked = selected.length === roleIds.length;

                  const isIndeterminate =
                    selected.length > 0 && selected.length < roleIds.length;

                  return (
                    <div key={type.id} className="grid">
                      <div className="flex gap-2 pb-2 items-center">
                        <strong>{`${type.descriptions} [${type.type}]`}</strong>

                        <Checkbox
                          indeterminate={isIndeterminate}
                          checked={isAllChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const newValues = Array.from(
                                new Set([...field.value, ...roleIds])
                              );
                              field.onChange(newValues);
                            } else {
                              field.onChange(
                                field.value.filter(
                                  (v: string) => !roleIds.includes(v)
                                )
                              );
                            }
                          }}
                        >
                          все
                        </Checkbox>
                      </div>

                      <CheckboxGroup
                        roles={type.roles}
                        selected={selected}
                        field={field}
                      />

                      <Divider size="small" />
                    </div>
                  );
                })}
              </div>
            )}
          />
        </Form.Item>

        <Flex justify="space-between">
          <Form.Item label={null}>
            <Button
              variant="solid"
              color="blue"
              htmlType="submit"
              loading={isSubmitting}
            >
              Добавить
            </Button>
          </Form.Item>

          <Button variant="solid" color="default" onClick={onCancel}>
            Закрыть
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

export default AddRoleTemplate;
