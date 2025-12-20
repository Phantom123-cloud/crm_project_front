import { Button, Modal } from "antd";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useCreateCitizenshipMutation,
  useLazyAllCitizenshipsQuery,
} from "@/app/services/citizenships/citizenshipsApi";
import ReferenceItemForm from "@/components/forms/ReferenceItemForm";
import { PlusOutlined } from "@ant-design/icons";
import { useOnModal } from "@/hooks/useOnModal";
import {
  useCreateLanguageMutation,
  useLazyAllLanguagesQuery,
} from "@/app/services/languages/languagesApi";

type Props = {
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

const AddReferenceItem: React.FC<Props> = ({ page, limit, type }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      localeEn: "",
      localeRu: "",
    },
  });
  const { callMessage } = useUiContext();
  const [createCitizenship] = useCreateCitizenshipMutation();
  const [createLanguage] = useCreateLanguageMutation();

  const [triggerCitizenships] = useLazyAllCitizenshipsQuery();
  const [triggerLanguages] = useLazyAllLanguagesQuery();
  const { onOpen, onCancel, isOpen } = useOnModal();

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await (type === "citizenship"
        ? createCitizenship(data)
        : createLanguage(data)
      ).unwrap();

      await (type === "citizenship"
        ? triggerCitizenships({ page, limit })
        : triggerLanguages({ page, limit })
      ).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      reset();
      onCancel();
    }
  };

  return (
    <div className="flex justify-end mb-10">
      <Button
        color="green"
        variant="outlined"
        icon={<PlusOutlined />}
        onClick={onOpen}
      >
        Добавить
      </Button>
      <Modal
        title="Добавить новый тип роли"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpen}
        footer={null}
        onCancel={onCancel}
      >
        <ReferenceItemForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          control={control}
          isSubmitting={isSubmitting}
          required
          onCancel={onCancel}
          text="Сохранить"
        />
      </Modal>
    </div>
  );
};

export default AddReferenceItem;
