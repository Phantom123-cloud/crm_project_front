import RolesGuard from "@/components/layout/RolesGuard";
import { useAllLanguagesQuery } from "@/app/services/languages/languagesApi";
import AddReferenceItem from "@/components/modals/add/AddReferenceItem";
import { usePaginationState } from "@/hooks/usePaginationState";
import ReferenceItemData from "@/components/data/ReferenceItemData";

const Languages = () => {
  const { onChange, page, limit } = usePaginationState();
  const { data, isLoading } = useAllLanguagesQuery({ page, limit });

  return (
    <RolesGuard access={"view_languages"}>
      <RolesGuard access={"create_languages"}>
        <AddReferenceItem page={page} limit={limit} type={"languages"} />
      </RolesGuard>
      <ReferenceItemData
        page={page}
        limit={limit}
        onChange={onChange}
        access={{
          update: "update_languages",
          delete: "delete_languages",
        }}
        data={data?.data?.languages ?? []}
        isLoading={isLoading}
        total={data?.data?.total ?? 1}
        type={"languages"}
      />
    </RolesGuard>
  );
};

export default Languages;
