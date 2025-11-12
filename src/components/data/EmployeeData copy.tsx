import { useUpdateEmployeesMutation } from "@/app/services/employees/employeesApi";
import {
  useLazyUserByIdQuery,
  useUserByIdQuery,
} from "@/app/services/users/usersApi";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button, Form, Input, Select } from "antd";
import { useEffect } from "react";
import TextArea from "antd/es/input/TextArea";

const schema = z.object({
  email: z.email("Некоректный email"),
  fullName: z.string(),
  notes: z.string(),
  tradingСode: z.string(),
  birthDate: z.string(),
  dateFirstTrip: z.string(),
  isInMarriage: z.boolean(),
  isHaveChildren: z.boolean(),
  isHaveDriverLicense: z.boolean(),
  drivingExperience: z.int(),
  isHaveInterPassport: z.boolean(),
  // files: z.array(z.file()).max(10),
});

type FormValues = z.infer<typeof schema>;

const EmployeeData = () => {
  const { id } = useParams();
  const { data } = useUserByIdQuery(id as string);
  const [triggerUserData] = useLazyUserByIdQuery();
  const [updateEmployee] = useUpdateEmployeesMutation();
  const { callMessage } = useUiContext();
  // const userData = data?.data?.user;

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      // files: [],
    },
  });

  useEffect(() => {
    if (data && data.data && data.data.user.employee) {
      const { employee, email } = data.data.user;
      const {
        birthDate,
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
        email,
        // fullName,
        birthDate: birthDate ?? "",
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
  }, [data, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();

      // if (data.files && data.files.length) {
      //   data.files.forEach((file) => {
      //     formData.append("files", file);
      //   });
      // }

      const userId = id as string;
      const { message } = await updateEmployee({
        formData,
        id: userId,
      }).unwrap();
      await triggerUserData(userId).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
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
        label="Фамилия Имя Отчество"
        style={{ textAlign: "start" }}
        validateStatus={errors.fullName ? "error" : ""}
        help={errors.fullName?.message}
      >
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => <Input {...field} onChange={field.onChange} />}
        />
      </Form.Item>
      <Form.Item
        label="Email"
        validateStatus={errors.email ? "error" : ""}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => <Input type="email" {...field} />}
        />
      </Form.Item>
      <Form.Item
        label="Дата рождения"
        validateStatus={errors.birthDate ? "error" : ""}
        help={errors.birthDate?.message}
      >
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => <Input type="date" {...field} />}
        />
      </Form.Item>
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
      {/* <Form.Item
        label="Документы"
        validateStatus={errors.files ? "error" : ""}
        help={errors.files?.message}
      >
        <Controller
          name="files"
          control={control}
          render={({ field }) => (
            <input
              type="file"
              className="border p-2"
              multiple
              accept=".pdf,.jpg,.png"
              onChange={(e) => {
                field.onChange(
                  e.target.files ? Array.from(e.target.files) : []
                );
              }}
            />
          )}
        />
      </Form.Item> */}

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

export default EmployeeData;
