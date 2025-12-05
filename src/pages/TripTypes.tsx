import TripTypesData from "@/components/data/TripTypesData";
import { useState } from "react";
import AddTripType from "@/components/modals/add/AddTripType";
import AddButton from "@/components/UI/buttons/AddButton";
// import RolesGuard from "@/components/layout/RolesGuard";

const TripTypes = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <AddButton onClick={() => setOpen(true)} text="Добавить" />
      <AddTripType isOpen={isOpen} setOpen={setOpen} />
      <TripTypesData />
    </>
  );
};

export default TripTypes;
