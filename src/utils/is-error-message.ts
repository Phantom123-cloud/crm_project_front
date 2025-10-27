export const errorMessages = (err: any) => {
  const hasErrorField =
    typeof err === `object` &&
    err !== null &&
    `data` in err &&
    typeof err.data === `object` &&
    err.data !== null &&
    `message` in err.data;

  return hasErrorField
    ? err?.data?.message
    : err?.message ?? "Что-то пошло не так. Попробуйте снова.";
};
