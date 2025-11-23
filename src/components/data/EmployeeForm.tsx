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
import { removeUnchangedFields } from "@/utils/removeUnchangedEmployeeItems";
import EmployeeKnowledgeAndContacts from "../EmployeeKnowledgeAndContacts";
import RolesGuard from "../layout/RolesGuard";

const schema = z.object({
  notes: z.optional(z.string()),
  tradingСode: z.optional(z.string()),
  dateFirstTrip: z.optional(z.string()),
  isInMarriage: z.optional(z.boolean()),
  isHaveChildren: z.optional(z.boolean()),
  isHaveDriverLicense: z.optional(z.boolean()),
  drivingExperience: z.optional(z.string()),
  isHaveInterPassport: z.optional(z.boolean()),
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
        drivingExperience: drivingExperience ?? "",
        notes: notes ?? "",
        isInMarriage,
        isHaveChildren,
        isHaveDriverLicense,
        isHaveInterPassport,
      });
    }
  }, [employee, reset]);

  const onSubmit = async (formData: Partial<FormValues>) => {
    try {
      removeUnchangedFields<Employee, FormValues>(employee, formData);
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

  const selected = [
    { label: "В браке?", name: "isInMarriage" },
    { label: "Есть дети?", name: "isHaveChildren" },
    { label: "Загран паспорт?", name: "isHaveInterPassport" },
    { label: "Водительские права?", name: "isHaveDriverLicense" },
  ];

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

      {selected.map((item, index) => (
        <Form.Item
          key={index}
          label={item.label}
          validateStatus={errors[item.name as KeyValue] ? "error" : ""}
          help={errors[item.name as KeyValue]?.message}
        >
          <Controller
            name={item.name as KeyValue}
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
      ))}

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
      <RolesGuard access={"update_employee"}>
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
      </RolesGuard>
      <EmployeeKnowledgeAndContacts
        userId={userId}
        foreignLanguages={employee?.foreignLanguages ?? []}
        phones={employee?.phones ?? []}
      />
    </Form>
  );
};

export default EmployeeForm;
