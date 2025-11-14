import type { LanguageLevel } from "@/app/services/users/usersType";
import { Tag } from "antd";

const ColorTabLanguagesLevel = ({ level }: { level: LanguageLevel }) => {
  const selectColorTabs = (level: LanguageLevel) => {
    if (["A1", "A2"].includes(level)) {
      return "warning";
    } else if (["B1", "B2"].includes(level)) {
      return "purple";
    } else if (["C1", "C2"].includes(level)) {
      return "success";
    } else if (level === "NATIVE") {
      return "gold";
    } else if (level === "SPOKEN") {
      return "default";
    } else {
      return "";
    }
  };

  return (
    <Tag color={selectColorTabs(level)}>
      {level === "NATIVE"
        ? "Носитель"
        : level === "SPOKEN"
        ? "Разговорный"
        : level}
    </Tag>
  );
};

export default ColorTabLanguagesLevel;
