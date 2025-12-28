import { Button, Flex, Form, Modal, Select } from "antd";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import RolesGuard from "@/components/layout/RolesGuard";
import { UserSwitchOutlined } from "@ant-design/icons";
import { useOnModal } from "@/hooks/useOnModal";
import { useLazyAllEmployeeTradingsQuery } from "@/app/services/employees/employeesApi";
import {
  useChangeOwnerWarehouseMutation,
  useLazyAllWarehousesApiQuery,
} from "@/app/services/warehouses/warehousesApi";

type Props = {
  queryWarehouse: {
    page: number;
    limit: number;
  };
  warehouseId: string;
  user: {
    email: string;
    id: string;
  };
};

const schema = z.object({
  ownerUserId: z.string().nonempty("Обязательное поле"),
});

type FormValues = z.infer<typeof schema>;

const UpdateOwnerWarehouse: React.FC<Props> = ({
  queryWarehouse,
  warehouseId,
  user,
}) => {
  const {
    handleSubmit,
    control,
    formState: { isDirty, errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ownerUserId: "",
    },
    mode: "onChange",
  });

  const { callMessage } = useUiContext();
  const [triggerEmployees, { data, isLoading }] =
    useLazyAllEmployeeTradingsQuery();
  const [triggerWarehouses] = useLazyAllWarehousesApiQuery();
  const [updateOwner] = useChangeOwnerWarehouseMutation();
  const { onOpen, onCancel, isOpen } = useOnModal();

  const owners = data?.data?.map((item) => ({
    value: item.userId,
    label: item.user.email,
  }));

  const mergedOwners = useMemo(() => {
    const base = owners ?? [];

    const exists = base.some((o) => o.value === user.id);
    console.log(exists);

    if (exists) return base;

    return [
      {
        value: user.id,
        label: `${user.email} (заблокирован)`,
        disabled: true,
      },
      ...base,
    ];
  }, [owners]);

  console.log(owners);

  useEffect(() => {
    if (isOpen) {
      triggerEmployees({ isNotAll: false, isViewWarehouses: true });
    }
  }, [isOpen]);

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await updateOwner({
        ...data,
        warehouseId,
      }).unwrap();
      await triggerWarehouses(queryWarehouse).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
      reset();
    }
  };

  useEffect(() => {
    reset({ ownerUserId: user.id });
  }, [user.id, reset]);

  return (
    <RolesGuard access={"change_owner_warehouse"}>
      <Button
        variant="outlined"
        icon={<UserSwitchOutlined />}
        onClick={onOpen}
        size="small"
      >
        ответственный
      </Button>
      <Modal
        title="Изменить ответстственного за склад"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpen}
        footer={null}
        onCancel={onCancel}
        loading={isLoading}
      >
        <Form onFinish={handleSubmit(onSubmit)} autoComplete="off">
          <Form.Item
            label="Ответственный за склад"
            validateStatus={errors.ownerUserId ? "error" : ""}
            help={errors.ownerUserId?.message}
          >
            <Controller
              name="ownerUserId"
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
                  options={mergedOwners}
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
                disabled={!isDirty}
              >
                Сохранить
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

export default UpdateOwnerWarehouse;
