import TripTypesData from "@/components/data/TripTypesData";
import AddTripType from "@/components/modals/add/AddTripType";
import { useAllTripTypesQuery } from "@/app/services/trip-types/tripTypesApi";
import { usePaginationControle } from "@/hooks/usePaginationControle";
// import RolesGuard from "@/components/layout/RolesGuard";

const TripTypes = () => {
  const { onChange, page, limit } = usePaginationControle();
  const { data, isLoading } = useAllTripTypesQuery({ page, limit });

  return (
    <>
      <AddTripType page={page} limit={limit} />
      <TripTypesData
        tripTypes={data?.data?.tripTypes ?? []}
        isLoading={isLoading}
        page={page}
        limit={limit}
        onChange={onChange}
        total={data?.data?.total ?? 1}
      />
    </>
  );
};

export default TripTypes;
