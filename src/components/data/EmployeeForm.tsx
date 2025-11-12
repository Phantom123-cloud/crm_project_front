import { useUpdateEmployeeFormMutation } from "@/app/services/employees/employeesApi";
import { useLazyUserByIdQuery } from "@/app/services/users/usersApi";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button, Form, Input, Select } from "antd";
import { useEffect } from "react";
import TextArea from "antd/es/input/TextArea";
import type { Employee } from "@/app/services/users/usersType";

const schema = z.object({
  notes: z.string(),
  tradingСode: z.string(),
  dateFirstTrip: z.string(),
  isInMarriage: z.boolean(),
  isHaveChildren: z.boolean(),
  isHaveDriverLicense: z.boolean(),
  drivingExperience: z.string(),
  isHaveInterPassport: z.boolean(),
});

type FormValues = z.infer<typeof schema>;
type KeyValue = keyof FormValues;

type Props = {
  employee?: Employee;
  userId: string;
};

const EmployeeForm: React.FC<Props> = ({ employee, userId }) => {
  const [triggerUserData] = useLazyUserByIdQuery();
  const [updateEmployee] = useUpdateEmployeeFormMutation();
  const { callMessage } = useUiContext();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (employee) {
      const {
        tradingСode,
        dateFirstTrip,
        isInMarriage,
        isHaveChildren,
        isHaveDriverLicense,
        drivingExperience,
        isHaveInterPassport,
        notes,
      } = employee;
      reset({
        tradingСode: tradingСode ?? "",
        dateFirstTrip: dateFirstTrip ?? "",
        isInMarriage,
        isHaveChildren,
        isHaveDriverLicense,
        drivingExperience,
        isHaveInterPassport,
        notes: notes ?? "",
      });
    }
  }, [employee, reset]);

  const onSubmit = async (formData: Partial<FormValues>) => {
    try {
      if (employee) {
        for (const key in formData) {
          const keyType = key as KeyValue;
          if (formData[keyType] === employee[keyType]) {
            delete formData[keyType];
          }
        }
      }

      const { message } = await updateEmployee({
        body: formData,
        id: userId,
      }).unwrap();
      await triggerUserData(userId).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      reset();
    }
  };
  return (
    <Form
      name="basic"
      onFinish={handleSubmit(onSubmit)}
      autoComplete="off"
      layout="vertical"
    >
      <Form.Item
        label="Код торгового"
        validateStatus={errors.tradingСode ? "error" : ""}
        help={errors.tradingСode?.message}
      >
        <Controller
          name="tradingСode"
          control={control}
          render={({ field }) => <Input type="number" {...field} />}
        />
      </Form.Item>
      <Form.Item
        label="Дата первого выезда"
        validateStatus={errors.dateFirstTrip ? "error" : ""}
        help={errors.dateFirstTrip?.message}
      >
        <Controller
          name="dateFirstTrip"
          control={control}
          render={({ field }) => <Input type="date" {...field} />}
        />
      </Form.Item>
      <Form.Item
        label="В браке?"
        validateStatus={errors.isInMarriage ? "error" : ""}
        help={errors.isInMarriage?.message}
      >
        <Controller
          name="isInMarriage"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={[
                { value: true, label: "Да" },
                { value: false, label: "Нет" },
              ]}
            />
          )}
        />
      </Form.Item>
      <Form.Item
        label="Есть дети?"
        validateStatus={errors.isHaveChildren ? "error" : ""}
        help={errors.isHaveChildren?.message}
      >
        <Controller
          name="isHaveChildren"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={[
                { value: true, label: "Да" },
                { value: false, label: "Нет" },
              ]}
            />
          )}
        />
      </Form.Item>
      <Form.Item
        label="Водительские права?"
        validateStatus={errors.isHaveDriverLicense ? "error" : ""}
        help={errors.isHaveDriverLicense?.message}
      >
        <Controller
          name="isHaveDriverLicense"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={[
                { value: true, label: "Да" },
                { value: false, label: "Нет" },
              ]}
            />
          )}
        />
      </Form.Item>
      <Form.Item
        label="Стаж вождения"
        validateStatus={errors.drivingExperience ? "error" : ""}
        help={errors.drivingExperience?.message}
      >
        <Controller
          name="drivingExperience"
          control={control}
          render={({ field }) => <Input type="number" {...field} />}
        />
      </Form.Item>
      <Form.Item
        label="Загран паспорт?"
        validateStatus={errors.isHaveInterPassport ? "error" : ""}
        help={errors.isHaveInterPassport?.message}
      >
        <Controller
          name="isHaveInterPassport"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={[
                { value: true, label: "Да" },
                { value: false, label: "Нет" },
              ]}
            />
          )}
        />
      </Form.Item>
      <Form.Item
        label="Комментарий"
        validateStatus={errors.notes ? "error" : ""}
        help={errors.notes?.message}
      >
        <Controller
          name="notes"
          control={control}
          render={({ field }) => <TextArea {...field} rows={4} />}
        />
      </Form.Item>

      <Form.Item label={null}>
        <Button
          variant="solid"
          color="blue"
          htmlType="submit"
          loading={isSubmitting}
          disabled={!isDirty}
        >
          Обновить данные
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmployeeForm;
