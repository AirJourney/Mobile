import { SearchBar } from "@nutui/nutui-react";
import { useTranslation } from "react-i18next";

interface ISearchPickerProps {
  onCancel: () => void;
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

const SearchPicker = (props: ISearchPickerProps) => {
  const { onCancel, value, onChange, placeholder } = props;
  const { t } = useTranslation();
  const search = (v: string) => {
    onChange(v);
  };

  const onCancelSearch = () => {
    onChange("");
    onCancel();
  };
  return (
    <SearchBar
      shape="round"
      value={value}
      placeholder={placeholder}
      onChange={search}
      onClear={()=>search("")}
      right={<span onClick={onCancelSearch}>{t("cancel")}</span>}
    />
  );
};
export default SearchPicker;
