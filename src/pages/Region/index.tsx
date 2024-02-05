import { useCallback, useMemo } from "react";
import { Elevator } from "@nutui/nutui-react";
import data from "@constant/data/countryFullName.json";
import { useAppSelector } from "@utils/hooks";
import { useLocation, useNavigate } from "react-router-dom";


export const getInfo = (locale: "cn"|"tc"|"en",code: string)=>{
  const info = data.find((item) => item.code === code);
  return {
    name: info?.name[locale],
    phoneCode: info?.phoneCode,
    code: info?.code,
  };
};


const Region = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useAppSelector((state) => state.commonSetting.language);
  const dataList = useMemo(() => {
    const result: { title: string; list: any[] }[] = [];
    for (const eachCountry of data) {
      const { code, phoneCode, name } = eachCountry;
      const firstLetter = name.en[0];
      const index = result.findIndex((item) => item.title === firstLetter);
      if (index === -1) {
        result.push({
          title: firstLetter,
          list: [{ name: name[language], phoneCode, code }],
        });
      }
      if (index > -1) {
        result[index].list.push({
          name: name[language],
          phoneCode,
          code,
        });
      }
    }
    return result.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
  }, [language]);

  const onItemClick = useCallback(
    (item: any) => {
      navigate(location.state.from, { replace: true, state: { ...item } });
    },
    [location.pathname],
  );
  return (
    <Elevator
      list={dataList}
      height="100%"
      style={{
        //@ts-ignore
        "--nutui-elevator-list-item-font-size": "14px",
        "--nutui-elevator-list-item-code-font-size": "12px",
        "--nutui-elevator-list-item-bars-inner-item-font-size": "12px",
      }}
      onItemClick={(_: string, item: any) => onItemClick(item)}
    >
      <Elevator.Context.Consumer>
        {(value) => {
          return (
            <span
              key={value.code}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                margin: "0 15px",
              }}
            >
              <span>
                {value?.name}[{value.code}]
              </span>
              <span>{value.phoneCode}</span>
            </span>
          );
        }}
      </Elevator.Context.Consumer>
    </Elevator>
  );
};
export default Region;
