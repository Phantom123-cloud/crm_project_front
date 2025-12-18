import { Select as AntdSelect } from "antd";
import type { ControllerRenderProps } from "react-hook-form";

type Props = {
  loading: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  field: ControllerRenderProps<any>;
  options?: {
    value: string;
    label: string;
  }[];
  onChange?: (value: any) => void;
};

const Select: React.FC<Props> = ({
  loading,
  onOpenChange,
  field,
  options,
  onChange,
}) => {
  return (
    <AntdSelect
      loading={loading}
      onOpenChange={onOpenChange}
      {...field}
      showSearch
      optionFilterProp="label"
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? "")
          .toLowerCase()
          .localeCompare((optionB?.label ?? "").toLowerCase())
      }
      options={options}
      // onChange={(value) => {
      //   field.onChange(value);
      // }}
      onChange={onChange}
    />
  );
};

export default Select;
