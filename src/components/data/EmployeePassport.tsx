import {
  useDisconnectCitizenshipMutation,
  useUpdateEmployeePassportMutation,
} from "@/app/services/employees/employeesApi";
import { useLazyUserByIdQuery } from "@/app/services/users/usersApi";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button, Divider, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import type { Employee } from "@/app/services/users/usersType";
import { useLazyAllCitizenshipsQuery } from "@/app/services/citizenships/citizenshipsApi";
import { removeUnchangedFields } from "@/utils/removeUnchangedEmployeeItems";
import RolesGuard from "../layout/RolesGuard";

const schema = z.object({
  fullName: z.string(),
  birthDate: z.string(),
  passportNumber: z.string(),
  citizenships: z.array(z.string()),
  registrationAddress: z.string(),
  actualAddress: z.string(),
});

type FormValues = z.infer<typeof schema>;
type Props = {
  employee?: Employee;
  userId: string;
};

const EmployeePassport: React.FC<Props> = ({ employee, userId }) => {
  const [triggerUserData] = useLazyUserByIdQuery();
  const [triggerCitizenData, { data, isLoading }] =
    useLazyAllCitizenshipsQuery();
  const [isOpenSelect, setIsOpenSelect] = useState(false);

  const [updateEmployee] = useUpdateEmployeePassportMutation();
  const [disconnectCitizenshipById] = useDisconnectCitizenshipMutation();
  const { callMessage } = useUiContext();

  useEffect(() => {
    if (isOpenSelect) {
      triggerCitizenData();
    }
  }, [isOpenSelect]);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const currentCitizenshis = employee?.citizenships;
  const citizenshipsSelect = (data?.data ?? []).reduce((acc, val) => {
    if (!currentCitizenshis?.some((c) => c.id === val.id)) {
      acc.push({ value: val.id, label: val.localeRu });
    }
    return acc;
  }, [] as { value: string; label: string }[]);

  useEffect(() => {
    if (employee) {
      const {
        fullName,
        birthDate,
        registrationAddress,
        actualAddress,
        passportNumber,
      } = employee;
      reset({
        fullName: fullName ?? "",
        birthDate: birthDate ?? "",
        registrationAddress: registrationAddress ?? "",
        actualAddress: actualAddress ?? "",
        passportNumber: passportNumber ?? "",
        citizenships: [],
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
  const disconnectCitizenship = async (citizenshipId: string) => {
    try {
      const { message } = await disconnectCitizenshipById({
        citizenshipId,
        userId,
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
        label="Фамилия Имя Отчество"
        validateStatus={errors.fullName ? "error" : ""}
        help={errors.fullName?.message}
      >
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => <Input {...field} />}
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
        label="Номер пасспорта"
        validateStatus={errors.passportNumber ? "error" : ""}
        help={errors.passportNumber?.message}
      >
        <Controller
          name="passportNumber"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>
      <Form.Item
        label="Адрес прописки"
        validateStatus={errors.registrationAddress ? "error" : ""}
        help={errors.registrationAddress?.message}
      >
        <Controller
          name="registrationAddress"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>
      <Form.Item
        label="Адрес проживания"
        validateStatus={errors.actualAddress ? "error" : ""}
        help={errors.actualAddress?.message}
      >
        <Controller
          name="actualAddress"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>
      <Divider />
      <div>
        <strong>Список текущих гражданств</strong>
        <div className="grid my-2 gap-3">
          {currentCitizenshis?.map((c) => (
            <div
              key={c.id}
              className="flex items-center w-[200px] justify-between"
            >
              <span>{c.localeRu}</span>
              <RolesGuard access={"update_employee"}>
                <Button
                  type="primary"
                  danger
                  onClick={() => disconnectCitizenship(c.id)}
                >
                  удалить
                </Button>
              </RolesGuard>
            </div>
          ))}
        </div>
      </div>
      <Divider />
      <RolesGuard access={"update_employee"}>
        <Form.Item
          label="Добавить гражданство"
          validateStatus={errors.citizenships ? "error" : ""}
          help={errors.citizenships?.message}
        >
          <Controller
            name="citizenships"
            control={control}
            render={({ field }) => (
              <Select
                loading={isLoading}
                maxCount={3}
                {...field}
                showSearch
                mode="multiple"
                optionFilterProp="label"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                onOpenChange={(isOpen) => setIsOpenSelect(isOpen)}
                options={citizenshipsSelect}
                onChange={(checkedValues) => {
                  const citizenshipsIds = citizenshipsSelect.map(
                    (r) => r.value
                  );
                  const others = field.value.filter(
                    (v: string) => !citizenshipsIds?.includes(v)
                  );
                  field.onChange([...others, ...checkedValues]);
                }}
              />
            )}
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
      </RolesGuard>
    </Form>
  );
};

export default EmployeePassport;
