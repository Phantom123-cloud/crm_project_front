export const useRolesGuard = (roles: string[]) => {
  const roleSet = new Set(roles ?? []);
  const isAcces = (access: string) => roleSet.has(access);

  return { isAcces };
};
