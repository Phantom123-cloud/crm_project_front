import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import CitizenshipsData from "@/components/data/CitizenshipsData";
import AddCitizenship from "@/components/modals/add/AddCitizenship";
import RolesGuard from "@/components/layout/RolesGuard";

const Citizenships = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <RolesGuard access={"view_citizenships"}>
      <div>
        <RolesGuard access={"create_citizenships"}>
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
          <AddCitizenship isOpen={isOpen} setOpen={setOpen} />
        </RolesGuard>
        <CitizenshipsData />
      </div>
    </RolesGuard>
  );
};

export default Citizenships;
