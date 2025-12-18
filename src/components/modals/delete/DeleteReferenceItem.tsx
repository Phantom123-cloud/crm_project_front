import { Button, Flex, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import {
  useDeleteCitizenshipMutation,
  useLazyAllCitizenshipsQuery,
} from "@/app/services/citizenships/citizenshipsApi";
import { useOnModal } from "@/hooks/useOnModal";
import {
  useDeleteLanguageMutation,
  useLazyAllLanguagesQuery,
} from "@/app/services/languages/languagesApi";

type Props = {
  localeRu: string;
  id: string;
  page: number;
  limit: number;
  type: "citizenship" | "languages";
};

const DeleteCitizenship: React.FC<Props> = ({
  id,
  localeRu,
  page,
  limit,
  type,
}) => {
  const { callMessage } = useUiContext();
  const [deleteCitizenship] = useDeleteCitizenshipMutation();
  const [deleteLanguage] = useDeleteLanguageMutation();

  const [triggerLanguages] = useLazyAllLanguagesQuery();
  const [triggerCitizenships] = useLazyAllCitizenshipsQuery();
  const { onOpen, onCancel, isOpen } = useOnModal();

  const handleDelete = async () => {
    try {
      const { message } = await (type === "citizenship"
        ? deleteCitizenship(id)
        : deleteLanguage(id)
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
    }
  };

  return (
    <>
      <Button
        color="danger"
        variant="outlined"
        size="small"
        icon={<DeleteOutlined />}
        onClick={onOpen}
      >
        удалить
      </Button>
      <Modal
        title={`Вы уверены в удалении - '${localeRu}'`}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isOpen}
        footer={null}
        onCancel={onCancel}
      >
        <Flex justify="space-between">
          <Button variant="solid" color="danger" onClick={handleDelete}>
            Удалить
          </Button>

          <Button onClick={onCancel} variant="solid" color="default">
            Закрыть
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default DeleteCitizenship;
