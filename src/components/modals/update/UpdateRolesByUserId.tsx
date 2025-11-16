import type { RolesObj } from "@/app/services/role-templates/roleTemplatesTypes";
import { useLazyFullInformationOnRolesQuery } from "@/app/services/roles/rolesApi";
import { Button, Flex, Form, Modal, Tabs } from "antd";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import CheckboxRolesGroupContoller from "../../CheckboxRolesGroupContoller";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";

type Props = {
  userId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const schema = z.object({
  unlock: z.array(z.string()),
  removeIndividual: z.array(z.string()),
  blockCurrent: z.array(z.string()),
  addUnused: z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;

const UpdateRolesByUserId: React.FC<Props> = ({
  userId,
  isOpen,
  setIsOpen,
}) => {
  const {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitting, defaultValues },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      unlock: [],
      removeIndividual: [],
      blockCurrent: [],
      addUnused: [],
    },
    mode: "onChange",
  });

  const [triggerData, { data, isLoading }] =
    useLazyFullInformationOnRolesQuery();
  const { callMessage } = useUiContext();

  // список блокнутых ролей из шаблона, юзаем для отблока
  const blockedTemplateRoles = data?.data?.blockedTemplateRoles ?? [];
  // список индив ролей вне шаблона, юзаем для их блока
  const individualAvailableRoles = data?.data?.individualAvailableRoles ?? [];
  // список доступных ролей из шаблона, юзаем для блока
  const templateAvailableRoles = data?.data?.templateAvailableRoles ?? [];
  // список не юзаных ролей (всех)
  const unusedRoles = data?.data?.unusedRoles ?? [];

  const tabItems: {
    array: (RolesObj | undefined)[];
    key:
      | "blockedTemplateRoles"
      | "individualAvailableRoles"
      | "templateAvailableRoles"
      | "unusedRoles";
    label: string;
    name: "unlock" | "removeIndividual" | "blockCurrent" | "addUnused";
  }[] = [
    {
      array: templateAvailableRoles,
      key: "templateAvailableRoles",
      name: "blockCurrent",
      label: "Шаблон(активные)",
    },
    {
      array: blockedTemplateRoles,
      key: "blockedTemplateRoles",
      label: "Шаблон(ограниченные)",
      name: "unlock",
    },

    {
      array: individualAvailableRoles,
      key: "individualAvailableRoles",
      label: "Индивидуальные",
      name: "removeIndividual",
    },
    {
      array: unusedRoles,
      key: "unusedRoles",
      label: "Не задействованные",
      name: "addUnused",
    },
  ];

  const onSubmit = async (data: FormValues) => {
    try {
      console.log(data);

      callMessage.success("message");
    } catch (err) {
      callMessage.error(errorMessages(err));
    } finally {
      onCancel();
    }
  };

  const onCancel = () => {
    setIsOpen(false);
    reset();
  };

  useEffect(() => {
    if (isOpen) {
      triggerData(userId);
    }
  }, [isOpen]);

  return (
    <Modal
      title="Изменить имя для типа роли"
      closable={{ "aria-label": "Custom Close Button" }}
      open={isOpen}
      footer={null}
      onCancel={onCancel}
      width={800}
      loading={isLoading}
    >
      <Form name="basic" onFinish={handleSubmit(onSubmit)} autoComplete="off">
        <Tabs
          defaultActiveKey="blockCurrent"
          // onChange={(key) => setKey(key as "disconnect" | "connect")}
          items={tabItems.map((item) => {
            return {
              key: item.key,
              label: item.label,
              forceRender: true,
              children: (
                <Form.Item>
                  <CheckboxRolesGroupContoller
                    name={item.name}
                    control={control}
                    roles={item?.array as RolesObj[]}
                  />
                </Form.Item>
              ),
            };
          })}
        />

        <Flex justify="space-between">
          <Form.Item label={null}>
            <Button
              variant="solid"
              color="blue"
              htmlType="submit"
              loading={isSubmitting}
              disabled={!isDirty}
            >
              Сохранить
            </Button>
          </Form.Item>

          <Button variant="solid" color="default" onClick={onCancel}>
            Закрыть
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

export default UpdateRolesByUserId;
