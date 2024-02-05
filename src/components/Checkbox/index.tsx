import Options from "./Options";
import Context from "./context";

interface ICheckboxGroup<T> {
  value: T[];
  options: {
    label: React.ReactNode;
    value: T;
  }[];
  onChange: (value: T[]) => void;
  max?: number;
}

interface ICheckbox<T> {
  children: React.ReactNode;
  value: T[];
  onChange: (value: T[]) => void;
  max?: number;
}

function Group<T extends string | number>(props: ICheckboxGroup<T>) {
  const { value, options, onChange, max } = props;
  return (
    <Checkbox value={value} onChange={onChange} max={max}>
      {options.map((option) => {
        return (
          <Options key={option.value} value={option.value}>
            {option.label}
          </Options>
        );
      })}
    </Checkbox>
  );
}

function Checkbox<T extends string | number>(props: ICheckbox<T>) {
  const { value, children, onChange, max } = props;
  const toggleCheck = (optionValue: T) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      if(max === 1 && value.length === 1){
        onChange([optionValue]);
        return;
      }
      if (max && value.length >= max) return;
      onChange([...value, optionValue]);
    }
  };
  return (
    <Context.Provider
      value={{
        max,
        value,
        onChange: toggleCheck,
      }}
    >
      {children}
    </Context.Provider>
  );
}

Checkbox.Group = Group;
Checkbox.Options = Options;
export default Checkbox;
