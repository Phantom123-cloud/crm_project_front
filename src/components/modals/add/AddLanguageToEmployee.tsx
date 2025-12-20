import { Button, Flex, Form, Modal, Select } from "antd";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";

import { useAddLanguageToEmployeeMutation } from "@/app/services/employees/employeesApi";
import { useLazyUserByIdQuery } from "@/app/services/users/usersApi";
import { useLazyAllLanguagesSelectQuery } from "@/app/services/languages/languagesApi";
import { useEffect, useState } from "react";
import RolesGuard from "@/components/layout/RolesGuard";
import { useOnModal } from "@/hooks/useOnModal";

type Props = {
  userId: string;
  currentLanguages: string[];
};

const schema = z.object({
  level: z.enum(
    ["A1", "A2", "B1", "B2", "C1", "C2", "SPOKEN", "NATIVE"],
    "Некоректные данные"
  ),
  languageId: z.string().nonempty("Обязательное поле"),
});

type FormValues = z.infer<typeof schema>;

const AddLanguageToEmployee: React.FC<Props> = ({
  userId,
  currentLanguages,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormValues>({
    defaultValues: { level: "A1", languageId: "" },
    resolver: zodResolver(schema),
  });

  const { callMessage } = useUiContext();
  const [addLanguageToEmployee] = useAddLanguageToEmployeeMutation();
  const [triggerUserData] = useLazyUserByIdQuery();
  const [triggerAllLanguages, { data }] = useLazyAllLanguagesSelectQuery();
  const [isOpenSelect, setIsOpenSelect] = useState(false);

  useEffect(() => {
    if (isOpenSelect) {
      triggerAllLanguages();
    }
  }, [isOpenSelect]);

  const { onOpen, onCancel, isOpen } = useOnModal();

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await addLanguageToEmployee({
        ...data,
        userId,
      }).unwrap();
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
        <Button
          type="primary"
          color="primary"
          onClick={onOpen}
        >
          добавить
        </Button>
      </div>
      <Modal
        title="Добавить язык"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpen}
        footer={null}
        onCancel={onCancel}
      >
        <Form
          onFinish={handleSubmit(onSubmit)}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Язык"
            validateStatus={errors.languageId ? "error" : ""}
            help={errors.languageId?.message}
          >
            <Controller
              name="languageId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  onOpenChange={(isOpen) => setIsOpenSelect(isOpen)}
                  options={(data?.data ?? [])
                    .filter((item) => !currentLanguages.includes(item.id))
                    .map((item) => ({
                      value: item.id,
                      label: item.localeRu,
                    }))}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Уровень знаний языка"
            validateStatus={errors.level ? "error" : ""}
            help={errors.level?.message}
          >
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { value: "A1", label: "A1" },
                    { value: "A2", label: "A2" },
                    { value: "B1", label: "B1" },
                    { value: "B2", label: "B2" },
                    { value: "C1", label: "C1" },
                    { value: "C2", label: "C2" },
                    { value: "NATIVE", label: "Носитель" },
                    { value: "SPOKEN", label: "Разговорный" },
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
    </RolesGuard>
  );
};

export default AddLanguageToEmployee;
