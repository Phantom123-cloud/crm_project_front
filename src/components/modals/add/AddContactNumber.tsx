import { Button, Flex, Form, Input, Modal, Select } from "antd";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";

import { useAddContactNumberToEmployeeMutation } from "@/app/services/employees/employeesApi";
import { useLazyUserByIdQuery } from "@/app/services/users/usersApi";
import { useOnModal } from "@/hooks/useOnModal";
import RolesGuard from "@/components/layout/RolesGuard";

type Props = {
  userId: string;
};

const schema = z.object({
  option: z.enum(["mobile", "whatsapp", "telegram"], "Некоректные данные"),
  number: z.string().nonempty("Обязательное поле"),
});

type FormValues = z.infer<typeof schema>;

const AddContactNumber: React.FC<Props> = ({ userId }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormValues>({
    defaultValues: { option: "mobile", number: "" },
    resolver: zodResolver(schema),
  });

  const { callMessage } = useUiContext();
  const [addContactNumber] = useAddContactNumberToEmployeeMutation();
  const [triggerUserData] = useLazyUserByIdQuery();
  const { onOpen, onCancel, isOpen } = useOnModal();

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await addContactNumber({ ...data, userId }).unwrap();
      await triggerUserData(userId).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
      reset();
    }
  };

  return (
    <RolesGuard access={"update_accounts"}>
      <div className="flex justify-end">
        <Button type="primary" color="primary" onClick={onOpen}>
          добавить
        </Button>
        <Modal
          title="Добавить контактные данные для связи"
          closable={{ "aria-label": "Custom Close Button" }}
          open={isOpen}
          footer={null}
          onCancel={onCancel}
        >
          <Form
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
            autoComplete="off"
            labelCol={{ span: 5 }}
          >
            <Form.Item
              label="Номер телефона"
              validateStatus={errors.number ? "error" : ""}
              help={errors.number?.message}
            >
              <Controller
                name="number"
                control={control}
                render={({ field }) => <Input type="number" {...field} />}
              />
            </Form.Item>

            <Form.Item
              label="Тип номера"
              validateStatus={errors.option ? "error" : ""}
              help={errors.option?.message}
            >
              <Controller
                name="option"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: "mobile", label: "Мобильный" },
                      { value: "whatsapp", label: "WhatsApp" },
                      { value: "telegram", label: "Telegram" },
                    ]}
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
                  Добавить
                </Button>
              </Form.Item>

              <Button variant="solid" color="default" onClick={onCancel}>
                Закрыть
              </Button>
            </Flex>
          </Form>
        </Modal>
      </div>
    </RolesGuard>
  );
};

export default AddContactNumber;
