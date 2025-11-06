import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

type Props = {
  Icon?: typeof PlusOutlined | null;
  onClick: () => void;
  text: string;
  color?:
    | "default"
    | "green"
    | "primary"
    | "danger"
    | "blue"
    | "purple"
    | "cyan"
    | "magenta"
    | "pink"
    | "red"
    | "orange"
    | "yellow"
    | "volcano"
    | "geekblue"
    | "lime"
    | "gold";
  variant?: "text" | "link" | "outlined" | "dashed" | "solid" | "filled";
  position?: "end" | "start";
};

const AddButton: React.FC<Props> = ({
  Icon = PlusOutlined,
  onClick,
  text,
  position = "end",
  color = "green",
  variant = "outlined",
}) => {
  return (
    <div className={`flex justify-${position} mb-10`}>
      <Button
        color={color}
        variant={variant}
        icon={Icon === null ? "" : <Icon />}
        onClick={onClick}
      >
        {text}
      </Button>
    </div>
  );
};

export default AddButton;
