import { OrderListTag, getOrderList } from "@services/orderlist";
import { Cell, Skeleton, Tabbar, Tag } from "@nutui/nutui-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EFlightType } from "@constant/enum";
import { useNavigate } from "react-router-dom";
import { displayLocaleTime } from "@utils/index";

import "./index.less";

export function getStatus(status: number, t: any) {
  switch (status) {
  case -1:
    return t("Pending Payment");
  case 0:
    return t("Issuing");
  case 1:
    return t("Issuing Succeed");
  case 2:
    return t("Issuing Failed");
  case 10:
    return t("Changing");
  case 11:
    return t("Changing Succeed");
  case 12:
    return t("Changed Failed");
  case 20:
    return t("Refunding");
  case 21:
    return t("Refunding Succeed");
  case 22:
    return t("Refunding Failed");
  default:
    return "unknown";
  }
}
interface IDetailListDetail {
  orderId: string;
  orderDate: string;
  status: number;
  flightType: EFlightType;
  trip: string[][];
  totalPrices: string;
  flightNo: string[][];
  departTime: string[];
  arrivalTime: string[];
}

const DetailList = () => {
  const { t } = useTranslation();
  const [orderList, setOrderList] = useState<IDetailListDetail[]>([]);
  const [tag, setTag] = useState<OrderListTag>(OrderListTag.ALL);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allOrderList = await getOrderList(tag);
        setOrderList(
          allOrderList.content
            .filter((item) => !!item.shoppingInfo)
            .map((item) => {
              return {
                orderId: item.orderId,
                orderDate: displayLocaleTime(item.clientTime, "YYYY-MM-DD"),
                status: item.status,
                flightType: !item.shoppingInfo?.flightGroupInfoList
                  ? EFlightType.ONEWAY
                  : item.shoppingInfo?.flightGroupInfoList?.length === 1
                    ? EFlightType.ONEWAY
                    : EFlightType.ROUNDTRIP,
                trip: item.shoppingInfo?.flightGroupInfoList?.map((flight) => [
                  flight.departMultCityName,
                  flight.arriveMultCityName,
                ]),
                totalPrices: `${item.currency}${item.shoppingInfo?.policyDetailInfo.totalPrice}`,
                flightNo: item.shoppingInfo?.flightGroupInfoList?.map(
                  (flight) => [
                    flight.flightSegments
                      .map(
                        (flightInfo) =>
                          `${flightInfo.airlineInfo.code}${flightInfo.flightNo}`,
                      )
                      .join("/"),
                  ],
                ),
                departTime: item.shoppingInfo?.flightGroupInfoList?.map(
                  (flight) => displayLocaleTime(flight.departDateTimeFormat),
                ),
                arrivalTime: item.shoppingInfo?.flightGroupInfoList?.map(
                  (flight) => displayLocaleTime(flight.arriveDateTimeFormat),
                ),
              };
            }),
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tag]);
  const onSwitch = (value: number) => {
    switch (value) {
    case 0: {
      setTag(OrderListTag.ALL);
      break;
    }
    case 1: {
      setTag(OrderListTag.PAYMENT);
      break;
    }
    // case 2: {
    //   setTag(OrderListTag.PROCESSING);
    //   break;
    // }
    case 3: {
      setTag(OrderListTag.DONE);
      break;
    }
    }
  };

  return (
    <div className="detail-list">
      <div>
        {loading ? (
          <>
            <Skeleton rows={5} title animated className="detail-list__trip" />
            <Skeleton rows={5} title animated className="detail-list__trip" />
            <Skeleton rows={5} title animated className="detail-list__trip" />
          </>
        ) : (
          orderList.map((item) => (
            <DetailListItem key={item.orderId} {...item} />
          ))
        )}
      </div>
      <Tabbar fixed onSwitch={onSwitch}>
        <Tabbar.Item title={t("All Orders")} />
        <Tabbar.Item title={t("Pending Payment")} />
        <Tabbar.Item title={t("Waiting To Travel")} />
        <Tabbar.Item title={t("Completed")} />
      </Tabbar>
    </div>
  );
};
interface IDetailListItem {
  orderId: string;
  orderDate: string;
  status: number;
  flightType: EFlightType;
  trip: string[][];
  totalPrices: string;
  flightNo: string[][];
  departTime: string[];
  arrivalTime: string[];
}
const DetailListItem = (props: IDetailListItem) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const renderOneway = ({
    depart,
    arrival,
    price,
    flightNo,
    departTime,
    arrivalTime,
  }: any) => {
    return (
      <>
        <div
          className="detail-list__trip"
          onClick={() => {
            navigate("/detailpage?orderid=" + props.orderId);
          }}
        >
          <span>
            <Tag type="info">{t("One-way")}</Tag>
            <span>
              {depart}-{arrival}
            </span>
          </span>
          <span>
            {t("Total Price")}: {price}
          </span>
        </div>
        <div className="detail-list__flight">
          <span className="detail-list__flight__item">
            <span>{t("flightNo")}</span>
            <span>{flightNo}</span>
          </span>
          <span className="detail-list__flight__item">
            <span>{t("Departure time")}</span>
            <span>{departTime}</span>
          </span>
          <span className="detail-list__flight__item">
            <span>{t("Arrival time")}</span>
            <span>{arrivalTime}</span>
          </span>
        </div>
      </>
    );
  };
  const renderRoundtrip = ({
    trip,
    price,
    flightNo,
    departTime,
    arrivalTime,
  }: any) => {
    return (
      <>
        <div className="detail-list__trip">
          <span>
            <Tag type="info">{t("One-way")}</Tag>
            <span>
              {trip?.[0]?.[0]}-{trip?.[trip.length - 1]?.[1]}
            </span>
          </span>
          <span>
            {t("Total Price")}: {price}
          </span>
        </div>
        <div className="detail-list__flight">
          <span className="detail-list__flight__item">
            <span>{t("flightNo")}:</span>
            {flightNo.map((item: any) => (
              <span key={item}>{item}</span>
            ))}
          </span>
          <span className="detail-list__flight__item">
            <span>{t("Departure time")}:</span>
            {departTime.map((item: any) => (
              <span key={item}>{item}</span>
            ))}
          </span>
          <span className="detail-list__flight__item">
            <span>{t("Arrival time")}:</span>
            {arrivalTime.map((item: any) => (
              <span key={item}>{item}</span>
            ))}
          </span>
        </div>
      </>
    );
  };
  return (
    <Cell className="detail-list__item">
      <div className="detail-list__header">
        <span>
          {t("Booking No.")}: {props.orderId}
        </span>
        <span>
          {t("Date")}: {props.orderDate}
        </span>
        <span>
          {t("Status")}: {getStatus(props.status, t)}
        </span>
      </div>
      <div className="detail-list__body">
        {props.flightType === EFlightType.ONEWAY
          ? renderOneway({
            depart: props.trip?.[0]?.[0],
            arrival: props.trip?.[0]?.[1],
            price: props.totalPrices,
            flightNo: props.flightNo?.[0]?.[0],
            departTime: props.departTime?.[0],
            arrivalTime: props.arrivalTime?.[0],
          })
          : renderRoundtrip({
            trip: props.trip,
            price: props.totalPrices,
            flightNo: props.flightNo,
            departTime: props.departTime,
            arrivalTime: props.arrivalTime,
          })}
      </div>
    </Cell>
  );
};
export default DetailList;
