import { Button, Checkbox, Form, Input } from "antd";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUiContext } from "@/UIContext";
import {
  useLazyGetMeQuery,
  useLoginMutation,
} from "@/app/services/auth/authApi";
import { errorMessages } from "@/utils/is-error-message";
import { useNavigate } from "react-router-dom";
import { socket } from "@/socket";

const schema = z.object({
  email: z.email("Некоректный email"),
  password: z
    .string("")
    .nonempty("Обязательное поле")
    .min(6, "Минимальная длина пароля - 6 символов"),
  remember: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const { callMessage } = useUiContext();
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const [triggerMe] = useLazyGetMeQuery();

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await login(data).unwrap();
      await triggerMe().unwrap();
      navigate("/role-types");
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      reset();
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Form
        className="w-full"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
          required={true}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="example@mail.com" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Пароль"
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}
          required={true}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password {...field} placeholder="Пароль" />
            )}
          />
        </Form.Item>

        <Form.Item
          label={null}
          valuePropName="checked"
          validateStatus={errors.remember ? "error" : ""}
          help={errors.remember?.message}
        >
          <Controller
            name="remember"
            control={control}
            render={({ field: { value, onChange, ...rest } }) => (
              <Checkbox
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                {...rest}
              >
                Запомнить меня
              </Checkbox>
            )}
          />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Войти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
