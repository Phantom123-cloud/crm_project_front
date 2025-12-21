import type {
  LanguageLevel,
  PhoneSelection,
} from "@/app/services/users/usersType";
import { Button, Divider } from "antd";
import AddLanguageToEmployee from "./modals/add/AddLanguageToEmployee";
import AddContactNumber from "./modals/add/AddContactNumber";
import {
  useDeleteContactNumberToEmployeeMutation,
  useDeleteLanguageToEmployeeMutation,
} from "@/app/services/employees/employeesApi";
import { useLazyUserByIdQuery } from "@/app/services/users/usersApi";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import ColorTab from "./UI/tabs/ColorTabContactNumType";
import ColorTabLanguagesLevel from "./UI/tabs/ColorTabLanguagesLevel";
import RolesGuard from "./layout/RolesGuard";

type Props = {
  foreignLanguages: {
    id: string;
    level: LanguageLevel;
    language: {
      id: string;
      localeRu: string;
      localeEn: string;
    };
  }[];

  phones: {
    number: string;
    option: PhoneSelection;
    id: string;
  }[];
  userId: string;
};

const EmployeeKnowledgeAndContacts: React.FC<Props> = ({
  foreignLanguages,
  phones,
  userId,
}) => {
  const [deleteContact] = useDeleteContactNumberToEmployeeMutation();
  const [deleteLanguage] = useDeleteLanguageToEmployeeMutation();
  const [triggerUserData] = useLazyUserByIdQuery();
  const { callMessage } = useUiContext();

  const deleteItem = async (id: string, type: "language" | "contact") => {
    try {
      const { message } = await (type === "contact"
        ? deleteContact({
            userId,
            phoneId: id,
          })
        : deleteLanguage({
            userId,
            languageId: id,
          })
      ).unwrap();

      await triggerUserData(userId).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    }
  };

  return (
    <>
      <Divider />
      <div>
        <strong>Владение иностранными языками</strong>
        <div className="grid my-2 gap-3">
          {foreignLanguages?.map((l) => (
            <div
              key={l.id}
              className="flex items-center w-[300px] justify-between"
            >
              <span>{l.language.localeRu}</span>
              <ColorTabLanguagesLevel level={l.level} />
              <RolesGuard access={"update_accounts"}>
                <Button
                  type="primary"
                  danger
                  onClick={() => deleteItem(l.id, "language")}
                >
                  удалить
                </Button>
              </RolesGuard>
            </div>
          ))}
        </div>
        <AddLanguageToEmployee
          userId={userId}
          currentLanguages={
            foreignLanguages.map((item) => item.language.id) ?? []
          }
        />
      </div>
      <Divider variant="dashed" />

      <div>
        <strong>Контакты для связи</strong>
        <div className="grid my-2 gap-3">
          {phones?.map((phone) => (
            <div
              key={phone.id}
              className="flex items-center max-w-[300px] justify-between"
            >
              <span>{phone.number}</span>
              <ColorTab option={phone.option} />

              <RolesGuard access={"update_accounts"}>
                <Button
                  type="primary"
                  danger
                  onClick={() => deleteItem(phone.id, "contact")}
                >
                  удалить
                </Button>
              </RolesGuard>
            </div>
          ))}
        </div>
        <AddContactNumber userId={userId} />
      </div>
    </>
  );
};

export default EmployeeKnowledgeAndContacts;
