export function removeUnchangedFields<
  Value extends object,
  FormValues extends object
>(employee: Value | undefined, formData: Partial<FormValues>): void {
  if (!employee) return;

  Object.keys(formData).forEach((key) => {
    const keyF = key as keyof FormValues;
    const keyV = key as keyof Value;

    if (key in employee && formData[keyF] === employee[keyV]) {
      delete formData[keyF];
    }
  });
}
