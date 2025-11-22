import { useState } from "react";
import LanguagesData from "@/components/data/LanguagesData";
import AddLanguage from "@/components/modals/add/AddLanguage";
import AddButton from "@/components/UI/buttons/AddButton";
import RolesGuard from "@/components/layout/RolesGuard";

const Languages = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <RolesGuard access={"view_languages"}>
      <RolesGuard access={"create_languages"}>
        <AddButton onClick={() => setOpen(true)} text="Добавить" />
        <AddLanguage isOpen={isOpen} setOpen={setOpen} />
      </RolesGuard>
      <LanguagesData />
    </RolesGuard>
  );
};

export default Languages;
