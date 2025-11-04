import type { RoleItem } from "@/app/services/role-templates/roleTemplatesTypes";
import { Checkbox } from "antd";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

type Props<T extends FieldValues> = {
  roles: RoleItem[];
  selected: string[];
  field: ControllerRenderProps<T>;
};

function CheckboxGroup<T extends FieldValues>({
  roles,
  selected,
  field,
}: Props<T>) {
  return (
    <Checkbox.Group
      options={roles.map((role) => ({
        label: `${role.descriptions} [${role.name}]`,
        value: role.id,
      }))}
      value={selected}
      onChange={(checkedValues) => {
        const roleIds = roles.map((r) => r.id);
        const others = field.value.filter((v: string) => !roleIds.includes(v));
        field.onChange([...others, ...checkedValues]);
      }}
    />
  );
}

export default CheckboxGroup;
