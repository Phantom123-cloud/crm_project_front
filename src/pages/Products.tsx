import { useState } from "react";
import ProductsData from "@/components/data/ProductsData";
import AddProducts from "@/components/modals/add/AddProducts";
import AddButton from "@/components/UI/buttons/AddButton";
import { useAllProductsQuery } from "@/app/services/products/productsApi";

const Products = () => {
  const [isOpen, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useAllProductsQuery({ page, limit });
  return (
    <>
      <AddButton onClick={() => setOpen(true)} text="Добавить" />
      <AddProducts
        isOpen={isOpen}
        setOpen={setOpen}
        page={page}
        limit={limit}
      />
      <ProductsData
        products={data?.data?.products ?? []}
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

export default Products;
