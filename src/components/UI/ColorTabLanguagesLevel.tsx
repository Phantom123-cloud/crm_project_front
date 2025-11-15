import type { LanguageLevel } from "@/app/services/users/usersType";
import { Tag } from "antd";

const ColorTabLanguagesLevel = ({ level }: { level: LanguageLevel }) => {
  const selectColorTabs = (level: LanguageLevel) => {
    if (["A1", "A2"].includes(level)) {
      return "#8bbb11";
    } else if (["B1", "B2"].includes(level)) {
      return "#3e2069";
    } else if (["C1", "C2"].includes(level)) {
      return "#a02669";
    } else if (level === "NATIVE") {
      return "#3c8618";
    } else if (level === "SPOKEN") {
      return "#434343";
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
