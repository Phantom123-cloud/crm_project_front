import { useState } from "react";
import LanguagesData from "@/components/data/LanguagesData";
import AddLanguage from "@/components/modals/add/AddLanguage";
import AddButton from "@/components/UI/buttons/AddButton";

const Languages = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <AddButton onClick={() => setOpen(true)} text="Добавить" />
      <LanguagesData />
      <AddLanguage isOpen={isOpen} setOpen={setOpen} />
    </>
  );
};

export default Languages;
