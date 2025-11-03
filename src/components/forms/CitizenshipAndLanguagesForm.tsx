import type { CitizenshipAndLanguage } from "@/app/services/citizenships/citizenshipType";
import { Button, Flex, Form, Input } from "antd";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormHandleSubmit,
} from "react-hook-form";

type Props = {
  handleSubmit: UseFormHandleSubmit<{
    code: string;
    localeEn: string;
    localeRu: string;
  }>;
  onSubmit: (data: CitizenshipAndLanguage) => Promise<void>;
  errors: FieldErrors<{
    code: string;
    localeEn: string;
    localeRu: string;
  }>;
  control: Control<{
    code: string;
    localeEn: string;
    localeRu: string;
  }>;
  isSubmitting: boolean;
  isDirty?: boolean;
  onCancel: () => void;
  text: string;
  required?: boolean;
};

const CitizenshipAndLanguagesForm: React.FC<Props> = ({
  handleSubmit,
  onSubmit,
  errors,
  control,
  isSubmitting,
  isDirty = true,
  onCancel,
  text,
  required = false,
}) => {
  return (
    <Form
      name="basic"
      onFinish={handleSubmit(onSubmit)}
      autoComplete="off"
      labelCol={{ span: 6 }}
    >
      <Form.Item
        label="Код"
        validateStatus={errors.code ? "error" : ""}
        help={errors.code?.message}
        required={required}
      >
        <Controller
          name="code"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>
      <Form.Item
        label="Название (ру)"
        validateStatus={errors.localeRu ? "error" : ""}
        help={errors.localeRu?.message}
        required={required}
      >
        <Controller
          name="localeRu"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>
      <Form.Item
        label="Название (eng)"
        validateStatus={errors.localeEn ? "error" : ""}
        help={errors.localeEn?.message}
        required={required}
      >
        <Controller
          name="localeEn"
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

export default CitizenshipAndLanguagesForm;
