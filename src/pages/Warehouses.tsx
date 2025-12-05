import WarehousesData from "@/components/data/WarehousesData";
import AddButton from "@/components/UI/buttons/AddButton";
import { useState } from "react";

const Warehouses = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <AddButton onClick={() => setOpen(true)} text="Добавить" />
      <WarehousesData isOpen={isOpen} setOpen={setOpen} />
    </>
  );
};

export default Warehouses;
