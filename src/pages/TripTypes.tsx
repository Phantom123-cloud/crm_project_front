import TripTypesData from "@/components/data/TripTypesData";
import { useState } from "react";
import AddTripType from "@/components/modals/add/AddTripType";
import AddButton from "@/components/UI/buttons/AddButton";
import { useAllTripTypesQuery } from "@/app/services/trip-types/tripTypesApi";
// import RolesGuard from "@/components/layout/RolesGuard";

const TripTypes = () => {
  const [isOpen, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useAllTripTypesQuery({ page, limit });

  return (
    <>
      <AddButton onClick={() => setOpen(true)} text="Добавить" />
      <AddTripType
        isOpen={isOpen}
        setOpen={setOpen}
        page={page}
        limit={limit}
      />
      <TripTypesData
        tripTypes={data?.data?.tripTypes ?? []}
        isLoading={isLoading}
        page={page}
        limit={limit}
        setPage={setPage}
        setLimit={setLimit}
        total={data?.data?.total ?? 1}
      />
    </>
  );
};

export default TripTypes;
