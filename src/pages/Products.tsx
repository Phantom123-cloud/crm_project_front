import { useState } from "react";
import ProductsData from "@/components/data/ProductsData";
import AddProducts from "@/components/modals/add/AddProducts";
import AddButton from "@/components/UI/buttons/AddButton";

const Products = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <AddButton onClick={() => setOpen(true)} text="Добавить" />
      <AddProducts isOpen={isOpen} setOpen={setOpen} />
      <ProductsData />
    </>
  );
};

export default Products;
