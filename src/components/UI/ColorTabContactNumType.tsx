import { Tag } from "antd";

type Option = "mobile" | "whatsapp" | "telegram";
const ColorTabContactNumType = ({ option }: { option: Option }) => {
  const selectColorTabs = (option: Option) => {
    switch (option) {
      case "mobile":
        return "gold";
      case "whatsapp":
        return "green";
      case "telegram":
        return "blue";
      default:
        return "";
    }
  };
  return <Tag color={selectColorTabs(option)}>{option}</Tag>;
};

export default ColorTabContactNumType;
