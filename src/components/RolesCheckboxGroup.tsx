import { Divider } from "antd";
import CheckboxGroup from "./CheckboxGroup";
import type {
  Role,
  RolesObj,
} from "@/app/services/role-templates/roleTemplatesTypes";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

type Props<T extends FieldValues> = {
  array: (RolesObj | null)[];
  field: ControllerRenderProps<T>;
};

function RolesCheckboxGroup<T extends FieldValues>({ array, field }: Props<T>) {
  return (
    <div className="grid gap-5">
      {array.map((type, index) => {
        const roleIds = type?.roles.map((r) => r.id);
        const selected = field.value.filter((v: string) =>
          roleIds?.includes(v)
        );

        return (
          <div key={index}>
            <div className="grid">
              <strong>{`${type?.descriptions} [${type?.type}]`}</strong>
              <CheckboxGroup<T>
                roles={type?.roles ?? []}
                selected={selected}
                field={field}
              />
              <Divider size="small" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RolesCheckboxGroup;
