import { Button, Flex, Form, Input, Modal } from "antd";
import { useEffect, type SetStateAction } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useLazyAllCitizenshipsQuery,
  useUpdateCitizenshipMutation,
} from "@/app/services/citizenships/citizenshipsApi";
import CitizenshipForm from "@/components/forms/CitizenshipAndLanguagesForm";

type Props = {
  isOpen: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
  code: string;
  localeRu: string;
  localeEn: string;
  id: string;
  modalType: "UPDATE" | "DELETE";
  loading: boolean;
  page: number;
  limit: number;
};

const schema = z.object({
  code: z.string().nonempty("Обязательное поле"),
  localeEn: z.string().nonempty("Обязательное поле"),
  localeRu: z.string().nonempty("Обязательное поле"),
});

type FormValues = z.infer<typeof schema>;

const UpdateCitizenships: React.FC<Props> = ({
  isOpen,
  setOpen,
  id,
  code,
  modalType,
  localeRu,
  localeEn,
  loading,
  page,
  limit,
}) => {
  const {
    handleSubmit,
    control,
    formState: { isDirty, errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      localeEn: "",
      localeRu: "",
    },
    mode: "onChange",
  });

  const { callMessage } = useUiContext();
  const [updateCitizenship] = useUpdateCitizenshipMutation();
  const [triggerCitizenship] = useLazyAllCitizenshipsQuery();

  const onCancel = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const body = {
        code: data.code !== code && data.code?.length ? data.code : undefined,
        localeEn:
          data.localeEn !== localeEn && data.localeEn?.length
            ? data.localeEn
            : undefined,
        localeRu:
          data.localeRu !== localeRu && data.localeRu?.length
            ? data.localeRu
            : undefined,
      };

      const { message } = await updateCitizenship({ body, id }).unwrap();
      await triggerCitizenship({ page, limit }).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
    }
  };

  useEffect(() => {
    reset({ code, localeEn, localeRu });
  }, [code, localeEn, localeRu, reset]);

  return (
    modalType === "UPDATE" && (
      <Modal
        title="Редактировать данные"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpen}
        footer={null}
        onCancel={onCancel}
        loading={loading}
      >
        <CitizenshipForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          control={control}
          isSubmitting={isSubmitting}
          isDirty={isDirty}
          onCancel={onCancel}
          text="Сохранить"
        />
      </Modal>
    )
  );
};

export default UpdateCitizenships;
