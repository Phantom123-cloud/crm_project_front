import TripTypesData from "@/components/data/TripTypesData";
import AddTripType from "@/components/modals/add/AddTripType";
import { useAllTripTypesQuery } from "@/app/services/trip-types/tripTypesApi";
import { usePaginationState } from "@/hooks/usePaginationState";
import RolesGuard from "@/components/layout/RolesGuard";

const TripTypes = () => {
  const { onChange, page, limit } = usePaginationState();
  const { data, isLoading } = useAllTripTypesQuery({ page, limit });

  return (
    <RolesGuard access={"view_trip_types"}>
      <AddTripType page={page} limit={limit} />
      <TripTypesData
        tripTypes={data?.data?.tripTypes ?? []}
        isLoading={isLoading}
        page={page}
        limit={limit}
        onChange={onChange}
        total={data?.data?.total ?? 1}
      />
    </RolesGuard>
  );
};

export default TripTypes;
