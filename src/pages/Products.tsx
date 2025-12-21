import ProductsData from "@/components/data/ProductsData";
import AddProducts from "@/components/modals/add/AddProducts";
import { useAllProductsQuery } from "@/app/services/products/productsApi";
import { usePaginationState } from "@/hooks/usePaginationState";

const Products = () => {
  const { onChange, page, limit } = usePaginationState();
  const { data, isLoading } = useAllProductsQuery({ page, limit });
  return (
    <>
      <AddProducts page={page} limit={limit} />
      <ProductsData
        products={data?.data?.products ?? []}
        isLoading={isLoading}
        page={page}
        limit={limit}
        onChange={onChange}
        total={data?.data?.total ?? 1}
      />
    </>
  );
};

export default Products;
