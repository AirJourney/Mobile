import { Check } from "@nutui/icons-react";
import { IOptionsProps } from "./interface";

const Options = (props: IOptionsProps) => {
  const { options, title, value, onChange } = props;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: ".5rem",
        flexDirection: "column",
      }}
    >
      <span
        style={{
          marginLeft: "1rem",
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        {title}
      </span>
      <div style={{ overflow: "scroll" }}>
        {options.map((item) => {
          return (
            <div
              style={{
                display: "flex",
                padding: "0.5rem 1rem",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #3333",
              }}
              key={item.value}
              onClick={() => {
                onChange(item.value);
              }}
            >
              <span
                style={{
                  fontSize: "1rem",
                }}
              >
                {item.label}
              </span>
              {value === item.value ? <Check /> : <div />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Options;