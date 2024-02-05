import { createContext } from "react";

const CheckboxContext = createContext<{
  max?: number;
  value: any[];
  onChange: (value: any) => void;
} | null>(null);

export default CheckboxContext;
