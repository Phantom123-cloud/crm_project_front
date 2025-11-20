import type { RolesObj } from "@/app/services/role-templates/roleTemplatesTypes";
import { useLazyFullInformationOnRolesQuery } from "@/app/services/roles/rolesApi";
import { Button, Flex, Form, Modal, Tabs, Tag, Tooltip } from "antd";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import CheckboxRolesGroupContoller from "../../CheckboxRolesGroupContoller";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useLazyUserByIdQuery,
  useUpdateUserRolesMutation,
} from "@/app/services/users/usersApi";

type Props = {
  userId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

type Tabs = {
  array: (RolesObj | undefined)[];
  key:
    | "blockedTemplateRoles"
    | "individualAvailableRoles"
    | "templateAvailableRoles"
    | "unusedRoles";
  label: string;
  name: "unlock" | "removeIndividual" | "blockCurrent" | "addUnused";
  guide: string;
}[];

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
    formState: { isDirty, isSubmitting },
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
  const [updateUserRoles] = useUpdateUserRolesMutation();
  const [triggerUserData] = useLazyUserByIdQuery();
  const { callMessage } = useUiContext();

  // список блокнутых ролей из шаблона, юзаем для отблока
  const blockedTemplateRoles = data?.data?.blockedTemplateRoles ?? [];
  // список индив ролей вне шаблона, юзаем для их блока
  const individualAvailableRoles = data?.data?.individualAvailableRoles ?? [];
  // список доступных ролей из шаблона, юзаем для блока
  const templateAvailableRoles = data?.data?.templateAvailableRoles ?? [];
  // список не юзаных ролей (всех)
  const unusedRoles = data?.data?.unusedRoles ?? [];

  const tabItems: Tabs = [
    {
      array: templateAvailableRoles,
      key: "templateAvailableRoles",
      name: "blockCurrent",
      label: "Шаблон(активные)",
      guide: "Выберите роли для блокировки",
    },
    {
      array: blockedTemplateRoles,
      key: "blockedTemplateRoles",
      label: "Шаблон(ограниченные)",
      name: "unlock",
      guide: "Выберите роли для разблокирования",
    },

    {
      array: individualAvailableRoles,
      key: "individualAvailableRoles",
      label: "Индивидуальные",
      name: "removeIndividual",
      guide: "Выберите роли для удаления индивидуального доступа",
    },
    {
      array: unusedRoles,
      key: "unusedRoles",
      label: "Не задействованные",
      name: "addUnused",
      guide: "Выберите роли для добавления индивидуального доступа",
    },
  ];

  const onSubmit = async (data: FormValues) => {
    try {
      const { message } = await updateUserRoles({ ...data, userId }).unwrap();
      await triggerData(userId).unwrap();
      await triggerUserData(userId).unwrap();
      callMessage.success(message);
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
      title="Манипуляции с правами доступа"
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
          items={tabItems.map((item) => {
            return {
              key: item.key,
              label: item.label,
              forceRender: true,
              children: (
                <Form.Item>
                  <div className="flex justify-end">
                    <Tooltip placement="topLeft" title={item.guide}>
                      <Tag color="#cd201f">как пользоваться?</Tag>
                    </Tooltip>
                  </div>
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
