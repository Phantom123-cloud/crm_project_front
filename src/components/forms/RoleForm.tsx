import type { CreateRole } from "@/app/services/roles/rolesType";
import type { TSelect } from "@/types";
import { Button, Flex, Form, Input, Select } from "antd";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormHandleSubmit,
} from "react-hook-form";

type Props = {
  handleSubmit: UseFormHandleSubmit<CreateRole>;
  onSubmit: (data: CreateRole) => Promise<void>;
  errors: FieldErrors<CreateRole>;
  control: Control<CreateRole>;
  isSubmitting: boolean;
  isDirty?: boolean;
  onCancel: () => void;
  text: string;
  required?: boolean;
  roleTypes: TSelect[];
};

const RoleForm: React.FC<Props> = ({
  handleSubmit,
  onSubmit,
  control,
  isSubmitting,
  isDirty = true,
  onCancel,
  text,
  required = false,
  errors,
  roleTypes,
}) => {
  return (
    <Form
      name="basic"
      onFinish={handleSubmit(onSubmit)}
      autoComplete="off"
      labelCol={{ span: 5 }}
    >
      <Form.Item
        label="Имя"
        validateStatus={errors.name ? "error" : ""}
        help={errors.name?.message}
        required={required}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>
      <Form.Item
        label="Описание"
        validateStatus={errors.descriptions ? "error" : ""}
        help={errors.descriptions?.message}
        required={required}
      >
        <Controller
          name="descriptions"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

      <Form.Item
        label="Тип роли"
        validateStatus={errors.roleTypeId ? "error" : ""}
        help={errors.roleTypeId?.message}
        required={required}
      >
        <Controller
          name="roleTypeId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              showSearch
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={roleTypes}
            />
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
            disabled={!isDirty}
          >
            {text}
          </Button>
        </Form.Item>

        <Button variant="solid" color="default" onClick={onCancel}>
          Закрыть
        </Button>
      </Flex>
    </Form>
  );
};

export default RoleForm;
