import { Button, Flex, Form, InputNumber, Modal, Select } from "antd";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useLazyAllStockMovementsQuery,
  useLazyWarehouseByIdApiQuery,
  useScrapProductMutation,
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
});

type FormValues = z.infer<typeof schema>;

const ScrapProduct: React.FC<Props> = ({
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
    },
  });
  const { callMessage } = useUiContext();
  const [scrapProduct] = useScrapProductMutation();
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
      const { message } = await scrapProduct({
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
      <Button onClick={onOpen} variant="outlined" color="danger">
        Списать
      </Button>
      <Modal
        title="Укажите данные для списания товара"
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

export default ScrapProduct;
