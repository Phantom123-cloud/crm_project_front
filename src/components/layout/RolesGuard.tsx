import { useUiContext } from "@/UIContext";

type Props = {
  children: React.ReactNode | null;
  access: string;
};

const RolesGuard: React.FC<Props> = ({ children, access }) => {
  const { isAcces } = useUiContext();

  if (!isAcces(access)) {
    return null;
  }

  return <>{children}</>;
};

export default RolesGuard;
