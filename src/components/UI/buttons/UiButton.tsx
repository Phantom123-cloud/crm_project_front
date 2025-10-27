import { Button } from "antd";
import type React from "react";
import { FileOutlined as IconType } from "@ant-design/icons";

type Props = {
  isBool: boolean;
  IconTrue: typeof IconType;
  IconFalse: typeof IconType;
  onClick: () => void;
};

const UiButton: React.FC<Props> = ({
  isBool,
  IconTrue,
  IconFalse,
  onClick,
}) => {
  return (
    <Button
      type="text"
      icon={isBool ? <IconTrue /> : <IconFalse />}
      onClick={onClick}
      style={{
        fontSize: "16px",
        width: 64,
        height: 64,
      }}
    />
  );
};

export default UiButton;
