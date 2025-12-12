import { Button, Flex, Form, InputNumber, Modal, Select } from "antd";
import { useEffect, useState, type SetStateAction } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import { useLazyAllProductsSelectQuery } from "@/app/services/products/productsApi";
import {
  useAddProductByWarehouseMutation,
  useLazyAllStockMovementsQuery,
  useLazyWarehouseByIdApiQuery,
} from "@/app/services/warehouses/warehousesApi";

type Props = {
  isOpen: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
  modalType: "UPDATE" | "ADD";
  queryWarehouse: {
    id: string;
    page: number;
    limit: number;
  };
  queryStock: {
    page: number;
    limit: number;
    status?: "TRANSIT" | "RECEIVED" | "CANCELLED";
  };
};

const schema = z.object({
  productId: z.string().nonempty("Обязательное поле"),
  quantity: z
    .int()
    .gte(1, "Значение должно быть больше 0")
    .nullable()
    .refine((v) => v !== null, {
      message: "Обязательное поле",
    }),
});

type FormValues = z.infer<typeof schema>;

const AddProductsByWarehouse: React.FC<Props> = ({
  isOpen,
  setOpen,
  modalType,
  queryWarehouse,
  queryStock,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      productId: "",
      quantity: 0,
    },
  });

  const { callMessage } = useUiContext();
  const [addProduct] = useAddProductByWarehouseMutation();
  const [isOpenSelect, setIsOpenSelect] = useState<boolean>(false);
  const [triggerProducts, { data, isLoading }] =
    useLazyAllProductsSelectQuery();
  const [triggerWarehouseById] = useLazyWarehouseByIdApiQuery();
  const [triggerStockMovements] = useLazyAllStockMovementsQuery();
  const products = (data?.data ?? []).map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  useEffect(() => {
    if (isOpenSelect) {
      triggerProducts();
    }
  }, [isOpenSelect]);

  const onCancel = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await addProduct({
        ...data,
        warehouseId: queryWarehouse.id,
      }).unwrap();
      await triggerWarehouseById(queryWarehouse).unwrap();
      await triggerStockMovements({
        ...queryStock,
        toWarehouseId: queryWarehouse.id,
      }).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
    }
  };

  return (
    modalType === "ADD" && (
      <Modal
        title="Добавить новый продукт"
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
    )
  );
};

export default AddProductsByWarehouse;
