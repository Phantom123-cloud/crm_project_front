import { Button, Modal } from "antd";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useLazyAllCitizenshipsQuery,
  useUpdateCitizenshipMutation,
} from "@/app/services/citizenships/citizenshipsApi";
import ReferenceItemForm from "@/components/forms/ReferenceItemForm";
import { EditOutlined } from "@ant-design/icons";
import { useOnModal } from "@/hooks/useOnModal";
import {
  useLazyAllLanguagesQuery,
  useUpdateLanguageMutation,
} from "@/app/services/languages/languagesApi";

type Props = {
  item: {
    id: string;
    code: string;
    localeRu: string;
    localeEn: string;
  };

  loading: boolean;
  page: number;
  limit: number;
  type: "citizenship" | "languages";
};

const schema = z.object({
  code: z
    .string()
    .nonempty("Обязательное поле")
    .min(2, "Минимальная длина - 2 символа")
    .max(5, "Максимальная длина - 5 символов"),
  localeEn: z
    .string()
    .nonempty("Обязательное поле")
    .min(2, "Минимальная длина - 2 символа")
    .max(30, "Максимальная длина - 30 символов"),
  localeRu: z
    .string()
    .nonempty("Обязательное поле")
    .min(2, "Минимальная длина - 2 символа")
    .max(30, "Максимальная длина - 30 символов"),
});

type FormValues = z.infer<typeof schema>;

const UpdateReferenceItem: React.FC<Props> = ({
  item,
  loading,
  page,
  limit,
  type,
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
  const [updateLanguage] = useUpdateLanguageMutation();

  const [triggerCitizenships] = useLazyAllCitizenshipsQuery();
  const [triggerLanguages] = useLazyAllLanguagesQuery();
  const { onOpen, onCancel, isOpen } = useOnModal();

  const onSubmit = async (data: FormValues) => {
    try {
      const body = {
        code:
          data.code !== item.code && data.code?.length ? data.code : undefined,
        localeEn:
          data.localeEn !== item.localeEn && data.localeEn?.length
            ? data.localeEn
            : undefined,
        localeRu:
          data.localeRu !== item.localeRu && data.localeRu?.length
            ? data.localeRu
            : undefined,
      };

      const { message } = await (type === "citizenship"
        ? updateCitizenship({
            body,
            id: item.id,
          })
        : updateLanguage({
            body,
            id: item.id,
          })
      ).unwrap();

      await (type === "citizenship"
        ? triggerCitizenships({ page, limit })
        : triggerLanguages({ page, limit })
      ).unwrap();

      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
      reset();
    }
  };

  useEffect(() => {
    reset(item);
  }, [item.code, item.localeEn, item.localeRu, reset]);

  return (
    <>
      <Button
        color="primary"
        variant="outlined"
        size="small"
        icon={<EditOutlined />}
        onClick={onOpen}
      >
        изменить
      </Button>
      <Modal
        title="Редактировать данные"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpen}
        footer={null}
        onCancel={onCancel}
        loading={loading}
      >
        <ReferenceItemForm
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
    </>
  );
};

export default UpdateReferenceItem;
