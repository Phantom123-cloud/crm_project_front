import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import LanguagesData from "@/components/data/LanguagesData";
import AddLanguage from "@/components/modals/add/AddLanguage";

const Languages = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-end mb-10">
        <Button
          color="cyan"
          variant="solid"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Добавить
        </Button>
      </div>
      <LanguagesData />
      <AddLanguage isOpen={isOpen} setOpen={setOpen} />
    </div>
  );
};

export default Languages;
