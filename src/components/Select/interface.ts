import { Picker } from "@nutui/nutui-react";
import { type Key, type ComponentProps } from "react";

export interface Options {
  label: string;
  value: string;
}
export interface IOptionsProps {
  title?: string;
  options: Options[];
  getKey?: Key | ((v: Options) => Key);
  value: string;
  onChange: (value: string) => void;
}

export interface SelectProps extends ComponentProps<typeof Picker> {
  label: string;
}
