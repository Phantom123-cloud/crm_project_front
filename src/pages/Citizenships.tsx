import ReferenceItemData from "@/components/data/ReferenceItemData";
import AddReferenceItem from "@/components/modals/add/AddReferenceItem";
import RolesGuard from "@/components/layout/RolesGuard";
import { usePaginationControle } from "@/hooks/usePaginationControle";
import { useAllCitizenshipsQuery } from "@/app/services/citizenships/citizenshipsApi";

const Citizenships = () => {
  const { onChange, page, limit } = usePaginationControle();
  const { data, isLoading } = useAllCitizenshipsQuery({ page, limit });

  return (
    <RolesGuard access={"view_citizenships"}>
      <RolesGuard access={"create_citizenships"}>
        <AddReferenceItem page={page} limit={limit} type={"citizenship"} />
      </RolesGuard>
      <ReferenceItemData
        page={page}
        limit={limit}
        onChange={onChange}
        access={{
          update: "update_citizenships",
          delete: "delete_citizenships",
        }}
        data={data?.data?.citizenships ?? []}
        isLoading={isLoading}
        total={data?.data?.total ?? 1}
        type={"citizenship"}
      />
    </RolesGuard>
  );
};

export default Citizenships;
