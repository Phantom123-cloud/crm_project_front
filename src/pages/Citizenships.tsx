import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import CitizenshipsData from "@/components/data/CitizenshipsData";
import AddCitizenship from "@/components/modals/add/AddCitizenship";

const Citizenships = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-end mb-10">
        <Button
          color="green"
          variant="outlined"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Добавить
        </Button>
      </div>
      <CitizenshipsData />
      <AddCitizenship isOpen={isOpen} setOpen={setOpen} />
    </div>
  );
};

export default Citizenships;
