import { useEffect, useState } from "react";
import { Input, Skeleton } from "@nutui/nutui-react";
import Policy from "@components/Policy";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  type IDetailDetailResponse,
  getOrderDetail,
} from "@services/orderdetail";
import FlightDetails from "@components/FlightDetails";
import Passenger from "../FillPage/Passenger";
import "./index.less";
import useAuth from "@utils/hooks/useAuth";

const DetailPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<IDetailDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  useAuth();

  useEffect(() => {
    const orderId = searchParams.get("orderid");
    const fetchOrderDetail = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const res = await getOrderDetail(orderId);
        if (res.status && res.content) {
          setData(res);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [searchParams]);

  if (!data) return <Skeleton rows={10} animated />;
  const {
    content: {
      flightPassengerList,
      contactInfo,
      shoppingInfo: { flightGroupInfoList, policyInfo },
    },
  } = data;

  return (
    <div className="fill-page">
      <div className="fill-docker">
        <div className="fill-city">
          <FlightDetails flightGroupInfoList={flightGroupInfoList} />
        </div>
        {!loading && (
          <div className="fill-policy" onClick={() => setShow(true)}>
            <span>
              {t("Policies and Baggage Allowance")}
            </span>
            <Policy
              visible={show}
              onClose={() => setShow(false)}
              policyInfo={policyInfo}
            />
          </div>
        )}
        <div className="fill-passenger">
          <div className="passenger-title">{t("Passenger")}</div>
          <Passenger readonly value={flightPassengerList} />
        </div>
        <div className="fill-contact">
          <div className="contact-title">{t("Contact Details")}</div>
          <div className="fill-contact-region">
            <div>{contactInfo[0].phoneArea}</div>
            <Input
              placeholder="Mobile number"
              readOnly
              value={contactInfo[0].mobilePhone}
            />
          </div>
          <Input placeholder="Email" className="fill-contact-region" readOnly value={contactInfo[0].email} />
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
