import RolesGuard from "@/components/layout/RolesGuard";
import { Button } from "antd";

type Props = {
  disabledLogout: boolean;
  disabledActions: boolean;
  onClickLogout: () => void;
  onClickActions: () => void;
  isActive: boolean;
};

const ActionsButton: React.FC<Props> = ({
  disabledLogout,
  disabledActions,
  onClickLogout,
  onClickActions,
  isActive,
}) => {
  return (
    <div className="flex gap-5">
      <RolesGuard access={"logout_users"}>
        <Button
          color="default"
          variant="outlined"
          size="small"
          disabled={disabledLogout}
          onClick={onClickLogout}
        >
          выйти
        </Button>
      </RolesGuard>
      <RolesGuard access={"change_account_status"}>
        <Button
          color={isActive ? "danger" : "green"}
          variant="outlined"
          size="small"
          disabled={disabledActions}
          onClick={onClickActions}
        >
          {isActive ? "забло-ть" : "актив-ть"}
        </Button>
      </RolesGuard>
    </div>
  );
};

export default ActionsButton;
