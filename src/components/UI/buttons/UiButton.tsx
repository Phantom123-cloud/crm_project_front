import { Button, Tooltip } from "antd";
import type React from "react";
import { FileOutlined as IconType } from "@ant-design/icons";

type Props = {
  Icon: typeof IconType;
  onClick: () => void;
  text: string;
};

const UiButton: React.FC<Props> = ({ onClick, Icon, text }) => {
  return (
    <Tooltip placement="bottom" title={text}>
      <Button
        type="text"
        icon={<Icon />}
        onClick={onClick}
        style={{
          fontSize: "14px",
          width: 40,
          height: 40,
        }}
      />
    </Tooltip>
  );
};

export default UiButton;
