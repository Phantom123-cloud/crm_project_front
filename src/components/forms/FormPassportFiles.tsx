import { useLazyUserByIdQuery } from "@/app/services/users/usersApi";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button, Form } from "antd";
import { useImportPasspostFilesMutation } from "@/app/services/files/filesApi";
import { useDropzone } from "react-dropzone";

const schema = z.object({
  files: z.array(z.file()).max(10, "Максимальное к-во - 10 файлов"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  userId: string;
};

const FormPassportFiles: React.FC<Props> = ({ userId }) => {
  const [triggerUserData] = useLazyUserByIdQuery();
  const [importPasspost] = useImportPasspostFilesMutation();
  const { callMessage } = useUiContext();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      files: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      if (data.files?.length) {
        data.files.forEach((file) => {
          formData.append("files", file);
        });
      }
      const { message } = await importPasspost({
        formData,
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

  const { getRootProps, getInputProps } = useDropzone();
  return (
    <Form
      name="basic"
      onFinish={handleSubmit(onSubmit)}
      autoComplete="off"
      layout="vertical"
    >
      <Form.Item
        validateStatus={errors.files ? "error" : ""}
        help={errors.files?.message}
      >
        <Controller
          name="files"
          control={control}
          render={({ field }) => (
            <div {...getRootProps()} className="border-2 border-dashed p-4">
              <input
                {...getInputProps()}
                onChange={(e) => {
                  field.onChange(
                    e.target.files ? Array.from(e.target.files) : []
                  );
                }}
              />
              <p>Перетащи файлы или кликни, чтобы выбрать</p>
            </div>
          )}
        />
      </Form.Item>

      <Form.Item label={null}>
        <Button
          block
          variant="solid"
          color="blue"
          htmlType="submit"
          loading={isSubmitting}
          disabled={!isDirty}
        >
          Загрузить
        </Button>
      </Form.Item>
    </Form>
  );
};
export default FormPassportFiles;
