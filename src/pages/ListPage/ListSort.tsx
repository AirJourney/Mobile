import { SortOrder, SortType } from "@constant/enum";
import { Divider, Popup, Radio } from "@nutui/nutui-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

interface SortProps {
  visible: boolean;
  onClose: () => void;
  onSure: (type: SortType, order: SortOrder) => void;
}

const ListSort = (props: SortProps, ref: React.Ref<IListSort>) => {
  const { visible, onClose, onSure } = props;
  const { t } = useTranslation();
  const [sortState, setSortState] = useState({
    index: 1,
    type: SortType.PRICE,
    order: SortOrder.ASC,
  });

  const onChange = (i: number) => {
    let type = SortType.PRICE;
    let order = SortOrder.ASC;
    switch (i) {
    case 1:
      type = SortType.PRICE;
      order = SortOrder.ASC;
      break;
    case 3:
      type = SortType.DEPART;
      order = SortOrder.ASC;
      break;
    case 4:
      type = SortType.DEPART;
      order = SortOrder.DES;
      break;
    case 5:
      type = SortType.ARRIVE;
      order = SortOrder.ASC;
      break;
    case 6:
      type = SortType.ARRIVE;
      order = SortOrder.DES;
      break;
    // case 5:
    //   type = SortType.DURATION;
    //   order = SortOrder.ASC;
    //   break;
    // case 6:
    //   type = SortType.DURATION;
    //   order = SortOrder.DES;
    //   break;
    }
    setSortState({
      index: i,
      type,
      order,
    });
    onSure(type, order);
    onClose();
  };

  const getData = () => {
    return { ...sortState };
  };

  useImperativeHandle(ref, () => ({ getData }));

  return (
    <Popup
      round
      visible={visible}
      style={{ height: "450px" }}
      position="bottom"
      onClose={onClose}
    >
      <div className="sort-title">
        <span>{t("sort")}</span>
      </div>
      <Radio.Group
        value={sortState.index}
        labelPosition="left"
        onChange={(value) => {
          onChange(Number(value));
        }}
      >
        <Radio value={1}>
          <div className="sort-des-left">{t("Price")}</div>
          <div className="sort-des-right">{t("Lowest")}</div>
        </Radio>
        <Divider
          style={{
            color: "#444",
            borderColor: "#444",
            opacity: "0.2",
            paddingRight: "16px",
          }}
        ></Divider>
        {/* <Radio value={2}>
          <span className="sort-des-left">飞行时长</span>
          <span className="sort-des-right">最短</span>
        </Radio> */}
        {/* <Divider
          style={{
            color: "#444",
            borderColor: "#444",
            opacity: "0.2",
            paddingRight: "16px",
          }}
        ></Divider> */}
        <Radio value={3}>
          <span className="sort-des-left">{t("DepartmentTime")}</span>
          <span className="sort-des-right">{t("earliest")}</span>
        </Radio>
        <Radio value={4}>
          <span className="sort-des-left"></span>
          <span className="sort-des-right">{t("Latest")}</span>
        </Radio>
        <Divider
          style={{
            color: "#444",
            borderColor: "#444",
            opacity: "0.2",
            paddingRight: "16px",
          }}
        ></Divider>
        <Radio value={5}>
          <span className="sort-des-left">{t("ArrivalTime")}</span>
          <span className="sort-des-right">{t("earliest")}</span>
        </Radio>
        <Radio value={6}>
          <span className="sort-des-left"></span>
          <span className="sort-des-right">{t("Latest")}</span>
        </Radio>
      </Radio.Group>
    </Popup>
  );
};
export interface IListSort {
  getData: () => { index: number; type: SortType; order: SortOrder };
}
export default forwardRef<IListSort, SortProps>(ListSort);
