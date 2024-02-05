import { useEffect, useState } from "react";
import { Button } from "@nutui/nutui-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IShoppingInfo } from "@services/shoppingdetail";
import { generateShopping } from "@services/generateShopping";
import FlightDetails from "@components/FlightDetails";
import Policy from "@components/Policy";
import { useTranslation } from "react-i18next";
import PricePanel from "./PricePanel";
import "./index.less";

const BookPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<IShoppingInfo>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const sku = new URLSearchParams(atob(searchParams.get("sku") || ""));
    const locale = searchParams.get("locale");
    const language = searchParams.get("language") || locale;
    const params = {
      campaign: searchParams.get("campaign"),
      deepLinkTokenId: searchParams.get("deepLinkTokenId"),
      locale,
      language,
      mktportal: searchParams.get("mktportal"),
      currency: sku.get("currency"),
      tripType: sku.get("tripType"),
      redisCode: decodeURIComponent(sku.get("redisCode") || ""),
      segmentSchema: decodeURIComponent(sku.get("segmentSchema") || ""),
      departTime: sku.get("departTime"),
      returnTime: sku.get("returnTime"),
      adult: sku.get("adult"),
      children: sku.get("children"),
      infant: sku.get("infant"),
      cabinType: sku.get("cabinType"),
      depart: sku.get("departCity"),
      arrive: sku.get("arriveCity"),
      skutype: sku.get("skutype"),
      currencyRate: sku.get("currencyRate"),
      cnyRate: sku.get("cnyRate"),
      profitId: sku.get("profitId"),
      revenueId: sku.get("revenueId"),
      penaltyId: sku.get("penaltyId"),
      baggageId: sku.get("baggageId"),
      group: sku.get("group"),
      IPCC: sku.get("IPCC"),
      shoppingId: sku.get("shoppingId"),
    };
    const fetchBookData = async () => {
      try {
        if (!searchParams || loading) return;
        setLoading(true);
        const res = await generateShopping(params);
        if (res.status && res.content) {
          setData(res.content);
        }
      } catch (err) {
        // console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookData();
  }, [searchParams]);

  const { flightGroupInfoList, policyDetailInfo, policyInfo } = data || {};
  return (
    <div className="book-page">
      <FlightDetails
        flightGroupInfoList={flightGroupInfoList}
        loading={loading}
      />
      {loading || !policyInfo ? null : (
        <div className="price-panel">
          <div
            className="price-panel-title"
            onClick={() => {
              setShow(true);
            }}
          >
            {t("Policies and Baggage Allowance")}
          </div>
          <Policy
            visible={show}
            onClose={() => setShow(false)}
            policyInfo={policyInfo}
          />
        </div>
      )}
      <PricePanel price={policyDetailInfo} loading={loading}  />
      {!loading && policyInfo && (
        <Button
          type="primary"
          size="large"
          onClick={() => {
            navigate(
              "/book" +
                window.location.href.slice(window.location.href.indexOf("?")),
              {
                state: { data, from: "mid" },
              },
            );
          }}
        >
          {t("next")}
        </Button>
      )}
    </div>
  );
};

export default BookPage;
