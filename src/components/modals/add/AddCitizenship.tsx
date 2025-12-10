import { Modal } from "antd";
import type { SetStateAction } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useCreateCitizenshipMutation,
  useLazyAllCitizenshipsQuery,
} from "@/app/services/citizenships/citizenshipsApi";
import CitizenshipForm from "@/components/forms/CitizenshipAndLanguagesForm";

type Props = {
  isOpen: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
  page: number;
  limit: number;
};

const schema = z.object({
  code: z.string().nonempty("Обязательное поле"),
  localeEn: z.string().nonempty("Обязательное поле"),
  localeRu: z.string().nonempty("Обязательное поле"),
});

type FormValues = z.infer<typeof schema>;

const AddCitizenship: React.FC<Props> = ({ isOpen, setOpen, page, limit }) => {
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
  const [triggerCitizenships] = useLazyAllCitizenshipsQuery();

  const onCancel = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await createCitizenship(data).unwrap();
      await triggerCitizenships({ page, limit }).unwrap();
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
      <CitizenshipForm
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
  );
};

export default AddCitizenship;
