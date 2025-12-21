import type { RolesObj } from "@/app/services/role-templates/roleTemplatesTypes";
import { Checkbox, Divider } from "antd";
import { Controller, type Control } from "react-hook-form";

type Props = {
  name: string;
  control?: Control<any> | undefined;
  roles: RolesObj[];
};

const CheckboxRolesGroupContoller: React.FC<Props> = ({
  name,
  control,
  roles,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field }) => (
        <div className="grid gap-5">
          {roles.map((type) => {
            // список всех id
            const roleIds = type.roles.map((r) => r.id);

            // список выбранных всех id
            const selected = field.value.filter((v: string) =>
              roleIds.includes(v)
            );
            const isAllChecked = selected.length === roleIds.length;

            // срабатывает когда выбран 1 или более чекбоксов
            const isIndeterminate =
              selected.length > 0 && selected.length < roleIds.length;

            return (
              <div key={type.id} className="grid">
                <div className="flex gap-2 pb-2 items-center">
                  <strong>{`${type.descriptions} [${type.type}]`}</strong>

                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllChecked}
                    onChange={(e) => {
                      // если нажали
                      if (e.target.checked) {
                        // делаем новую копию массива всех ранее выделенных и исходного,
                        // делаем Set что бы не было дублей
                        // и в массив преобразуем
                        const newValues = Array.from(
                          new Set([...field.value, ...roleIds])
                        );
                        // передаём в форму
                        field.onChange(newValues);
                      } else {
                        // если вернули false,удаляем из формы все которые ранее были выбраны
                        field.onChange([]);
                      }
                    }}
                  >
                    все
                  </Checkbox>
                </div>

                <Checkbox.Group
                  options={type.roles.map((role) => ({
                    label: `${role.descriptions} [${role.name}]`,
                    value: role.id,
                  }))}
                  value={selected}
                  onChange={(checkedValues) => {
                    const roleIds = type.roles.map((r) => r.id);
                    const others = field.value.filter(
                      (v: string) => !roleIds.includes(v)
                    );
                    field.onChange([...others, ...checkedValues]);
                  }}
                />

                <Divider size="small" />
              </div>
            );
          })}
        </div>
      )}
    />
  );
};

export default CheckboxRolesGroupContoller;
