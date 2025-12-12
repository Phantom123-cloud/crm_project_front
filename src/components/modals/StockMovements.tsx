import { Button, Flex, Form, Input, Modal, Select } from "antd";
import { useEffect, useState, type SetStateAction } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useLazyAllWarehousesApiQuery,
  useStockMovementsMutation,
} from "@/app/services/warehouses/warehousesApi";
import { useLazyAllEmployeeTradingsQuery } from "@/app/services/employees/employeesApi";

type Props = {
  query: {
    page: number;
    limit: number;
    isActive?: boolean;
  };
  products: {
    key: string;
    name: boolean;
    quantity: boolean;
  }[];
};

// const schema = z.object({
//   name: z
//     .string()
//     .nonempty("Обязательное поле")
//     .min(5, "Минимальная длина - 5")
//     .max(20, "Максимальная длина - 20"),
//   ownerUserId: z.string().nonempty("Обязательное поле"),
// });

// type FormValues = z.infer<typeof schema>;

const StockMovementsModal: React.FC<Props> = ({ query, products }) => {
  console.log(query, products);

  // const {
  //   handleSubmit,
  //   control,
  //   formState: { errors, isSubmitting },
  //   reset,
  // } = useForm<FormValues>({
  //   resolver: zodResolver(schema),
  //   defaultValues: {
  //     name: "",
  //     ownerUserId: "",
  //   },
  // });
  // const [isOpenSelect, setIsOpenSelect] = useState<boolean>(false);
  // const { callMessage } = useUiContext();
  // const [stockMovements] = useStockMovementsMutation();
  // const [triggerWarehouses] = useLazyAllWarehousesApiQuery();
  // const [triggerTradings, { data, isLoading }] =
  //   useLazyAllEmployeeTradingsQuery();
  // const tradings = (data?.data ?? []).map((item) => {
  //   return {
  //     value: item.userId,
  //     label: item.fullName ? item.fullName : item.user.email,
  //   };
  // });
  // const onCancel = () => {
  //   setOpen(false);
  //   reset();
  // };

  // const onSubmit = async (data: FormValues) => {
  //   try {
  //     const { message } = await createWarehouse({
  //       ...data,
  //       type: isExistCentral ? "PERSONAL" : "CENTRAL",
  //     }).unwrap();
  //     await triggerWarehouses(query).unwrap();
  //     callMessage.success(message);
  //   } catch (err) {
  //     callMessage.error(errorMessages(err));
  //   } finally {
  //     onCancel();
  //   }
  // };

  // useEffect(() => {
  //   if (isOpenSelect) {
  //     triggerTradings({ isNotAll: false });
  //   }
  // }, [isOpenSelect]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={showModal} variant="outlined" color="blue">
        Переместить товар
      </Button>
      <Modal
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        footer={null}
        onCancel={onCancel}
      >
        {/* <Form onFinish={handleSubmit(onSubmit)} autoComplete="off">
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
      </Form> */}
      </Modal>
    </>
  );
};

export default StockMovementsModal;
