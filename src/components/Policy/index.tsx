import { Popup, Table, Tabs } from "@nutui/nutui-react";
import { useState } from "react";
import type {
  IBaggageInfo,
  ICancelChangeFormatted,
  ICancelChangeInfo,
  IPenaltyInfo,
  IPolicyInfo,
} from "@services/shoppingdetail";
import { ECurrencyType } from "@constant/enum";
import { useAppSelector } from "@utils/hooks";
import { useTranslation } from "react-i18next";
import "./index.less";
import { TableColumnProps } from "@nutui/nutui-react/dist/types/packages/table/types";

const Baggage = (props: IBaggageInfo) => {
  const { t } = useTranslation();
  const baggageColumns:TableColumnProps[]= [
    {
      title: "type",
      key: "type",
      align: "center",
      render: (record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "20px",
          }}
        >
          {record.type.replace(/^\S/, (s: string) => s.toUpperCase())}
        </div>
      ),
    },
    {
      title: "content",
      key: "content",
      render: (record) => {
        const { content, bagType } = record;
        return (
          <div className="baggage-content">
            <div className="baggage-content-title">{bagType}</div>
            <div className="baggage-content-desc">
              {content.weightAndPieceDesc},{content.description}
            </div>
          </div>
        );
      },
    },
  ];
  const baggageData = {
    checkedNote: props.checkedNote,
    handNote: props.handNote,
    details: [
      {
        type: t("Adults"),
        bagType: t("Checked Baggage"),
        content: props?.checkedFormatted?.adultDetail,
      },
      {
        type: t("Adults"),
        bagType: t("Carry-on Baggage"),
        content: props?.handFormatted?.adultDetail,
      },
      {
        type: t("Children"),
        bagType: t("Checked Baggage"),
        content: props?.checkedFormatted?.childDetail,
      },
      {
        type: t("Children"),
        bagType: t("Carry-on Baggage"),
        content: props?.handFormatted?.childDetail,
      },
      {
        type: t("Infants"),
        bagType: t("Checked Baggage"),
        content: props?.checkedFormatted?.infantDetail,
      },
      {
        type: t("Infants"),
        bagType: t("Carry-on Baggage"),
        content: props?.handFormatted?.infantDetail,
      },
    ],
  };

  return (
    <Table
      columns={baggageColumns}
      data={baggageData.details.filter((v) => !!v.content)}
      showHeader={false}
    />
  );
};

const Policies = (props: IPenaltyInfo) => {
  const { changeInfo, cancelInfo } = props;
  const { t } = useTranslation();
  const getData = (
    v: ICancelChangeInfo,
  ): {
    adult?: ICancelChangeFormatted[];
    child?: ICancelChangeFormatted[];
    infant?: ICancelChangeFormatted[];
  } => {
    const result: {
      adult?: ICancelChangeFormatted[];
      child?: ICancelChangeFormatted[];
      infant?: ICancelChangeFormatted[];
    } = {
      adult: undefined,
      child: undefined,
      infant: undefined,
    };
    const { formatted } = v;
    if (formatted) {
      const { adultList, childList, infantList } = formatted;
      if (adultList) {
        result.adult = adultList;
      }
      if (childList) {
        result.child = childList;
      }
      if (infantList) {
        result.infant = infantList;
      }
    }
    return result;
  };
  const cancelData = getData(cancelInfo);
  const changeData = getData(changeInfo);
  const adult = {
    cancel: cancelData?.adult,
    change: changeData?.adult,
  };
  const child = {
    cancel: cancelData?.child,
    change: changeData?.child,
  };
  const infant = {
    cancel: cancelData?.infant,
    change: changeData?.infant,
  };
  return (
    <>
      <PolicyItem {...adult} type={t("Adults")} />
      <PolicyItem {...child} type={t("Children")} />
      <PolicyItem {...infant} type={t("Infants")} />
    </>
  );
};
const PolicyItem = (props: any) => {
  const { t } = useTranslation();
  const currency = useAppSelector((state) => state.commonSetting.currency);
  const getColumns = (type: "cancel"|"change"): TableColumnProps[] => [
    {
      title: "timeText",
      key: "timeText",
      render: (record) => {
        return t(record.timeText);
      },
    },
    {
      title: "specialText",
      key: "specialText",
      render: (record) => {
        if (record.specialText === "-1") {
          if (type === "cancel") {
            return t("policyInfo1");
          }
          return t("policyInfo2");
        }
        return `${ECurrencyType[currency]} ${record.specialText}`;
      },
    },
  ];
  if (props.cancel || props.change) {
    return (
      <>
        <p className="policy-policies-type">{props.type}</p>
        {props.cancel && (
          <>
            <div className="policy-policies-title">{t("Cancellation")}</div>
            <Table
              columns={getColumns("cancel")}
              data={props.cancel}
              showHeader={false}
            />
          </>
        )}
        {props.change && (
          <>
            <div className="policy-policies-title">{t("Change")}</div>
            <Table
              columns={getColumns("change")}
              data={props.change}
              showHeader={false}
            />
          </>
        )}
      </>
    );
  }
  return null;
};

const Policy = (props: {
  visible: boolean;
  onClose: () => void;
  policyInfo: IPolicyInfo;
}) => {
  const [tab2value, setTab2value] = useState("Baggage");
  const {
    policyInfo: { baggageInfoList, penaltyInfoList },
    ...left
  } = props;
  return (
    <Popup
      className="policy-popup"
      style={{ height: "80%" }}
      round
      position="bottom"
      {...left}
    >
      <Tabs
        style={{ height: "100%" }}
        value={tab2value}
        onChange={(value) => setTab2value(value as string)}
      >
        <Tabs.TabPane
          title="Baggage"
          value="Baggage"
          className="policy-baggage"
        >
          <div>
            <Baggage {...baggageInfoList?.[0]} />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane
          title="Policies"
          value="Policies"
          className="policy-policies"
        >
          <div>
            <Policies {...penaltyInfoList?.[0]} />
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Popup>
  );
};

export default Policy;
