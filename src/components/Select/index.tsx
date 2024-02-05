import { Right } from "@nutui/icons-react";
import { Cell, Picker } from "@nutui/nutui-react";
import { useState } from "react";
import { SelectProps } from "./interface";

 const Select = ({ label, ...left }: SelectProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <>
      <Cell
        className="nutui-cell--clickable"
        title={label}
        align="center"
        onClick={() => {
          setShowTooltip(true);
        }}
        extra={<Right />}
      />
      <Picker
        visible={showTooltip}
        onClose={() => setShowTooltip(false)}
        {...left}
      />
    </>
  );
};
export default Select;