import { Button, Flex, Form, Input } from "antd";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormHandleSubmit,
} from "react-hook-form";

type Form = { name: string; descriptions: string };

type Props = {
  handleSubmit: UseFormHandleSubmit<Form>;
  onSubmit: (data: Form) => Promise<void>;
  errors: FieldErrors<Form>;
  control: Control<Form>;
  isSubmitting: boolean;
  isDirty?: boolean;
  onCancel: () => void;
  text: string;
  required?: boolean;
};
const RoleTypeForm: React.FC<Props> = ({
  handleSubmit,
  onSubmit,
  control,
  isSubmitting,
  isDirty = true,
  onCancel,
  text,
  required = false,
  errors,
}) => {
  return (
    <Form
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

export default RoleTypeForm;
