import { Button, Flex, Form, Input, InputNumber, Modal, Select } from "antd";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useLazyAllStockMovementsQuery,
  useLazyWarehouseByIdApiQuery,
  useSaleProductMutation,
} from "@/app/services/warehouses/warehousesApi";
import type { ProductsByWarehouse } from "@/app/services/warehouses/warehousesType";
import { useOnModal } from "@/hooks/useOnModal";

type Props = {
  queryWarehouse: {
    id: string;
    page: number;
    limit: number;
  };
  stockItems: ProductsByWarehouse[];

  queryStockMove: {
    page: number;
    limit: number;
    status?: "TRANSIT" | "RECEIVED" | "CANCELLED";
  };
};

const schema = z.object({
  quantity: z
    .int()
    .gte(1, "Значение должно быть больше 0")
    .nullable()
    .refine((v) => v !== null, {
      message: "Обязательное поле",
    }),
  productId: z.string().nonempty("Обязательное поле"),
  reason: z.string().nonempty("Обязательное поле"),
  stockMovementType: z.enum(["SALE", "GIFT", "DELIVERY"], "Некоректные данные"),
});

type FormValues = z.infer<typeof schema>;

const SaleProduct: React.FC<Props> = ({
  queryWarehouse,
  stockItems,
  queryStockMove,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      quantity: 0,
      productId: "",
      reason: "",
      stockMovementType: "SALE",
    },
  });
  const { callMessage } = useUiContext();
  const [saleProduct] = useSaleProductMutation();
  const [triggerCurrentWarehouse] = useLazyWarehouseByIdApiQuery();
  const [triggerStockMove] = useLazyAllStockMovementsQuery();

  const products = stockItems.map((product) => {
    return {
      value: product.product.id,
      label: product.product.name,
    };
  });
  const { onOpen, onCancel, isOpen } = useOnModal();

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await saleProduct({
        ...data,
        warehouseId: queryWarehouse.id,
      }).unwrap();
      await triggerCurrentWarehouse(queryWarehouse).unwrap();
      await triggerStockMove({
        ...queryStockMove,
        warehouseId: queryWarehouse.id,
      }).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
      reset();
    }
  };

  return (
    <>
      <Button onClick={onOpen} variant="outlined" color="yellow">
        Продажа
      </Button>
      <Modal
        title="Укажите данные для оформления продажи"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpen}
        footer={null}
        onCancel={onCancel}
      >
        <Form
          onFinish={handleSubmit(onSubmit)}
          autoComplete="off"
          labelCol={{ span: 6 }}
        >
          <Form.Item
            label="Продукт"
            validateStatus={errors.productId ? "error" : ""}
            help={errors.productId?.message}
            required
          >
            <Controller
              name="productId"
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
                  options={products}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="К-во"
            validateStatus={errors.quantity ? "error" : ""}
            help={errors.quantity?.message}
            required={true}
          >
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => <InputNumber {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Тип продажи"
            validateStatus={errors.stockMovementType ? "error" : ""}
            help={errors.stockMovementType?.message}
            required
          >
            <Controller
              name="stockMovementType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { value: "SALE", label: "Продажа" },
                    { value: "GIFT", label: "Подарок к договору" },
                    { value: "DELIVERY", label: "Доставка" },
                  ]}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Договора"
            validateStatus={errors.reason ? "error" : ""}
            help={errors.reason?.message}
            required={true}
          >
            <Controller
              name="reason"
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
                // disabled={!isDirty}
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
    </>
  );
};

export default SaleProduct;
