import { useCreateTripMutation } from "@/app/services/trips/tripsApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import { Button, Flex, Form, Input } from "antd";
import { useLazyAllEmployeeTradingsQuery } from "@/app/services/employees/employeesApi";
import { useEffect, useState } from "react";
import { useLazyAllTripTypesSelectQuery } from "@/app/services/trip-types/tripTypesApi";
import Select from "@/components/UI/selects/Select";

const schema = z.object({
  dateFrom: z.string().nonempty("Обязательное поле"),
  dateTo: z.string().nonempty("Обязательное поле"),
  ownerUserId: z.string().nonempty("Обязательное поле"),
  tripTypesId: z.string().nonempty("Обязательное поле"),
});

type FormValues = z.infer<typeof schema>;
const CreateTrips = () => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      dateFrom: "",
      dateTo: "",
      ownerUserId: "",
      tripTypesId: "",
    },
  });
  const [isOpenSelect, setIsOpenSelect] = useState<{
    tradings: boolean;
    types: boolean;
  }>({
    tradings: false,
    types: false,
  });
  const { callMessage } = useUiContext();

  const [createTrips] = useCreateTripMutation();
  const [triggerTradings, { data, isLoading }] =
    useLazyAllEmployeeTradingsQuery();
  const [triggerTripTypes, { data: types, isLoading: isLoadingTypes }] =
    useLazyAllTripTypesSelectQuery();

  const tradings = (data?.data ?? []).map((item) => {
    return {
      value: item.userId,
      label: item.fullName ? item.fullName : item.user.email,
    };
  });

  const typesSelect = (types?.data ?? []).map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const dFrom = new Date(data.dateFrom);
      const dTo = new Date(data.dateTo);

      if (isNaN(dFrom.getTime()) || isNaN(dTo.getTime())) {
        throw new Error("Ошибка формата дат");
      }

      if (dTo < dFrom) {
        throw new Error(
          "Дата начала выезда не может быть больше даты окончания выезда"
        );
      }

      const { message } = await createTrips(data).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      reset();
    }
  };

  useEffect(() => {
    if (isOpenSelect.tradings) {
      triggerTradings({ isNotAll: true });
    }
    if (isOpenSelect.types) {
      triggerTripTypes();
    }
  }, [isOpenSelect.tradings, isOpenSelect.types]);

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <div className="flex justify-between gap-2">
        <Form.Item
          required
          label="Начало выезда"
          validateStatus={errors.dateFrom ? "error" : ""}
          help={errors.dateFrom?.message}
          className="w-full"
        >
          <Controller
            name="dateFrom"
            control={control}
            render={({ field }) => <Input type="date" {...field} />}
          />
        </Form.Item>
        <Form.Item
          required
          className="w-full"
          label="Конец выезда"
          validateStatus={errors.dateTo ? "error" : ""}
          help={errors.dateTo?.message}
        >
          <Controller
            name="dateTo"
            control={control}
            render={({ field }) => <Input type="date" {...field} />}
          />
        </Form.Item>
      </div>

      <Form.Item
        label="ГА/МВ (предварительно)"
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
              onOpenChange={(isOpen) =>
                setIsOpenSelect((prev) => ({ ...prev, tradings: isOpen }))
              }
              field={field}
              options={tradings}
              onChange={(value) => {
                field.onChange(value);
              }}
            />
          )}
        />
      </Form.Item>
      <Form.Item
        label="Тип выезда"
        validateStatus={errors.tripTypesId ? "error" : ""}
        help={errors.tripTypesId?.message}
        required
      >
        <Controller
          name="tripTypesId"
          control={control}
          render={({ field }) => (
            <Select
              loading={isLoadingTypes}
              onOpenChange={(isOpen) =>
                setIsOpenSelect((prev) => ({ ...prev, types: isOpen }))
              }
              field={field}
              options={typesSelect}
              onChange={(value) => {
                field.onChange(value);
              }}
            />
          )}
        />
      </Form.Item>

      <Flex justify="flex-end">
        <Form.Item label={null}>
          <Button
            variant="solid"
            color="blue"
            htmlType="submit"
            loading={isSubmitting}
            disabled={!isDirty}
          >
            Добавить
          </Button>
        </Form.Item>
      </Flex>
    </Form>
  );
};

export default CreateTrips;
