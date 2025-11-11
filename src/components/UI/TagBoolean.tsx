import { Tag } from "antd";

const TagBoolean = ({ isBool }: { isBool: boolean }) => {
  return (
    <Tag color={isBool ? "green" : "volcano"}>{isBool ? "Да" : "Нет"}</Tag>
  );
};

export default TagBoolean;
