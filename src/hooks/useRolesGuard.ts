export const useRolesGuard = (roles: string[]) => {
  const isAcces = (access: string) =>
    (roles ?? []).some((role) => role === access);

  return { isAcces };
};
