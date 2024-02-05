import { useContext } from "react";
import classNames from "classnames";
import Context from "./context";

import "./Options.less";

interface OptionsProps<T> {
  children: React.ReactNode;
  value: T;
}

function Options<T extends string | number>(props: OptionsProps<T>) {
  const ctx = useContext(Context);
  const { value, children } = props;
  const checked = ctx?.value.includes(value);
  return (
    <span
      className={classNames(
        "checkbox-option",
        checked && "checkbox-option-checked",
      )}
      onClick={() => {
        ctx?.onChange(value);
      }}
    >
      {children}
    </span>
  );
}

export default Options;
