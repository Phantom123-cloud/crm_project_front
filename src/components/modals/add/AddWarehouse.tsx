import { Button, Flex, Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useCreateWarehouseMutation,
  useLazyAllWarehousesApiQuery,
} from "@/app/services/warehouses/warehousesApi";
import { useLazyAllEmployeeTradingsQuery } from "@/app/services/employees/employeesApi";

type Props = {
  query: {
    page: number;
    limit: number;
    isActive?: boolean;
  };
  isExistCentral: boolean;
  isOpen: boolean;
  onCancel: () => void;
};

const schema = z.object({
  name: z
    .string()
    .nonempty("Обязательное поле")
    .min(5, "Минимальная длина - 5")
    .max(20, "Максимальная длина - 20"),
  ownerUserId: z.string().nonempty("Обязательное поле"),
});

type FormValues = z.infer<typeof schema>;

const AddWarehouse: React.FC<Props> = ({
  query,
  isExistCentral,
  isOpen,
  onCancel,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      ownerUserId: "",
    },
  });
  const [isOpenSelect, setIsOpenSelect] = useState<boolean>(false);
  const { callMessage } = useUiContext();
  const [createWarehouse] = useCreateWarehouseMutation();
  const [triggerWarehouses] = useLazyAllWarehousesApiQuery();
  const [triggerTradings, { data, isLoading }] =
    useLazyAllEmployeeTradingsQuery();
  const tradings = (data?.data ?? []).map((item) => {
    return {
      value: item.userId,
      label: item.fullName ? item.fullName : item.user.email,
    };
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await createWarehouse({
        ...data,
        type: isExistCentral ? "PERSONAL" : "CENTRAL",
      }).unwrap();
      await triggerWarehouses(query).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
      reset();
    }
  };

  useEffect(() => {
    if (isOpenSelect) {
      triggerTradings({ isNotAll: false });
    }
  }, [isOpenSelect]);

  return (
    <Modal
      title={
        isExistCentral
          ? "Добавить новый склад"
          : "Добавить центральный склад (единоразовое действие)"
      }
      closable={{ "aria-label": "Custom Close Button" }}
      open={isOpen}
      footer={null}
      onCancel={onCancel}
    >
      <Form
        onFinish={handleSubmit(onSubmit)}
        autoComplete="off"
        // labelCol={{ span: 7 }}
      >
        <Form.Item
          label="Имя"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
          required
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Ответственный"
          validateStatus={errors.ownerUserId ? "error" : ""}
          help={errors.ownerUserId?.message}
          required
        >
          <Controller
            name="ownerUserId"
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
                options={tradings}
                onChange={(value) => {
                  field.onChange(value);
                }}
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

export default AddWarehouse;
