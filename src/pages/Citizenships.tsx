import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import CitizenshipsData from "@/components/data/CitizenshipsData";
import AddCitizenship from "@/components/modals/add/AddCitizenship";
import RolesGuard from "@/components/layout/RolesGuard";
import { useAllCitizenshipsQuery } from "@/app/services/citizenships/citizenshipsApi";

const Citizenships = () => {
  const [isOpen, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useAllCitizenshipsQuery({ page, limit });

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
          <AddCitizenship
            isOpen={isOpen}
            setOpen={setOpen}
            page={page}
            limit={limit}
          />
        </RolesGuard>
        <CitizenshipsData
          citizenships={data?.data?.citizenships ?? []}
          isLoading={isLoading}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          total={data?.data?.total ?? 1}
        />
      </div>
    </RolesGuard>
  );
};

export default Citizenships;
