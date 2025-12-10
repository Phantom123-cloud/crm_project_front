import { useState } from "react";
import LanguagesData from "@/components/data/LanguagesData";
import AddLanguage from "@/components/modals/add/AddLanguage";
import AddButton from "@/components/UI/buttons/AddButton";
import RolesGuard from "@/components/layout/RolesGuard";
import { useAllLanguagesQuery } from "@/app/services/languages/languagesApi";

const Languages = () => {
  const [isOpen, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useAllLanguagesQuery({ page, limit });

  return (
    <RolesGuard access={"view_languages"}>
      <RolesGuard access={"create_languages"}>
        <AddButton onClick={() => setOpen(true)} text="Добавить" />
        <AddLanguage
          isOpen={isOpen}
          setOpen={setOpen}
          page={page}
          limit={limit}
        />
      </RolesGuard>
      <LanguagesData
        languages={data?.data?.languages ?? []}
        isLoading={isLoading}
        page={page}
        limit={limit}
        setPage={setPage}
        setLimit={setLimit}
        total={data?.data?.total ?? 1}
      />
    </RolesGuard>
  );
};

export default Languages;
