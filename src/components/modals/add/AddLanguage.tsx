import { Modal } from "antd";
import type { SetStateAction } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import LanguagesForm from "@/components/forms/CitizenshipAndLanguagesForm";
import {
  useCreateLanguageMutation,
  useLazyAllLanguagesQuery,
} from "@/app/services/languages/languagesApi";

type Props = {
  isOpen: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
};

const schema = z.object({
  code: z.string().nonempty("Обязательное поле"),
  localeEn: z.string().nonempty("Обязательное поле"),
  localeRu: z.string().nonempty("Обязательное поле"),
});

type FormValues = z.infer<typeof schema>;

const AddLanguage: React.FC<Props> = ({ isOpen, setOpen }) => {
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
  const [createLanguage] = useCreateLanguageMutation();
  const [triggerLanguages] = useLazyAllLanguagesQuery();

  const onCancel = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await createLanguage(data).unwrap();
      await triggerLanguages().unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
    }
  };

  return (
    <Modal
      title="Добавить новый тип роли"
      closable={{ "aria-label": "Custom Close Button" }}
      open={isOpen}
      footer={null}
      onCancel={onCancel}
    >
      <LanguagesForm
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        control={control}
        isSubmitting={isSubmitting}
        required={true}
        onCancel={onCancel}
        text="Сохранить"
      />
    </Modal>
  );
};

export default AddLanguage;
