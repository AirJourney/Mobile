import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { EmomentFormatType } from "@constant/enum";
import {
  Notify,
  Input,
  Toast,
  Dialog,
  Skeleton,
  Tag,
} from "@nutui/nutui-react";
import Policy from "@components/Policy";
import { useAppSelector, useRegionSelect } from "@utils/hooks";
import { passengersListSelector } from "@state/createSelector/passenger";
import { generateShopping } from "@services/generateShopping";
import { IShoppingInfo } from "@services/shoppingdetail";
import { refreshCache } from "@services/refreshCache";
import { ICreateOrderRequestType, booking } from "@services/booking";
import { displayLocaleTime } from "@utils/index";
import { getDepartArriveInfo, getTripSearch } from "@utils/business";
import useCache from "@utils/hooks/useCache";
import { IChangePassenger } from "@services/changeprice";
import { check } from "@services/check";
import Passenger from "./Passenger";
import Details from "./Details";
import PriceDetails from "./PriceDetails";
import "./index.less";
import { Right, RectRight, My2, IconFont } from "@nutui/icons-react";
import Baggage from "./Baggage";
import { IBaggage } from "@services/addonBaggage";

const remarkKey = {
  wego: "wego_click_id",
  skyscanner: "skyscanner_redirectid",
};
const priceFormat = (price: string) => {
  return JSON.parse(price.replace("\\", ""));
};
/**
 * 从中间页过来，数据从上层获取
 * 1. refresh
 *
 * deeplink跳转过来，需要存储
 * 1. 保存searchParams
 * 2. generateShopping
 * 3. refresh
 * @returns
 */
const FillPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [shoppingId, setShoppingId] = useState("");
  const [params, setParams] = useState<Record<string,string|null>>({});
  const selectedPassengersList = useAppSelector(passengersListSelector);
  const currency = useAppSelector((state) => state.commonSetting.currency);
  const [data, setData] = useState<IShoppingInfo>();
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const refreshState = useRef<{ count: number; id?: number }>({
    count: 0,
  });
  const [region, showRegionSelect] = useRegionSelect(
    JSON.parse(sessionStorage.getItem("fill_region") || "{\"code\": \"TW\",\"phoneCode\": \"+886\",\"name\": \"taiwan\"}"),
  );
  const [phone, setPhone] = useCache("", "fill_phone");
  const [email, setEmail] = useCache("", "fill_email");
  const [name, setName] = useCache("", "fill_name");
  const [baggageInfo, setBaggageInfo] = useState<IBaggage>();
  useEffect(() => {
    if (location?.state?.from === "mid") {
      // 从中间页过来
      setData(location.state.data);
      setShoppingId(location.state.data.shoppingId);
      refreshTask();
    } else {
      if(!params.departCity || !params.arriveCity) return;
      // 从deeplink跳转过来
      getDetail();
      refreshTask();
    }
    return () => {
      if (refreshState.current.id) {
        clearTimeout(refreshState.current.id);
        refreshState.current = {
          count: 0,
          id: 0,
        };
      }
    };
  }, [params]);

  useEffect(() => {
    const sku = searchParams.get("sku");
    const skuData = new URLSearchParams(atob(sku || ""));
    setParams({
      departTime: skuData.get("departTime"),
      returnTime: skuData.get("returnTime"),
      departCity: skuData.get("departCity"),
      arriveCity: skuData.get("arriveCity"),
      passenger: JSON.stringify([
        {"name":"Adult","count":skuData.get("adult")||1,"flag":"ADT"},
        {"name":"Children","count":skuData.get("children")||0,"flag":"CHD"},
        {"name":"Infants","count":skuData.get("infant")||0,"flag":"INF"}
      ]),
      tripType: skuData.get("tripType"),
      campaign: searchParams.get("campaign"),
      deepLinkTokenId: searchParams.get("deepLinkTokenId"),
      locale: searchParams.get("locale"),
      language: searchParams.get("language"),
      currency: skuData.get("currency"),
      redisCode: decodeURIComponent(skuData.get("redisCode") || ""),
      segmentSchema: decodeURIComponent(skuData.get("segmentSchema") || ""),
      adult: skuData.get("adult"),
      children: skuData.get("children"),
      infant: skuData.get("infant"),
      cabinType: skuData.get("cabinType"),
      skutype: skuData.get("skutype"),
      profitId: skuData.get("profitId"),
      revenueId: skuData.get("revenueId"),
      penaltyId: skuData.get("penaltyId"),
      baggageId: skuData.get("baggageId"),
      mktportal: searchParams.get("mktportal"),
      remark: searchParams.get(remarkKey[skuData.get("mktportal") as "wego" | "skyscanner"] || ""),
      group: skuData.get("group"),
      IPCC: skuData.get("IPCC"),
      shoppingId: skuData.get("shoppingId"),
    });
  },[searchParams]);
  
  useEffect(() => {
    if (!region || !region.phoneCode) return;
    sessionStorage.setItem("fill_region", JSON.stringify(region));
  }, [region]);

  const getFlightListParams = ()=>{
    const p = new URLSearchParams({
      departTime: params.departTime||"",
      returnTime: params.returnTime || "",
      departCity: params.departCity || "",
      arriveCity: params.arriveCity || "",
      passenger: params.passenger || "",
      cabinType: params.cabinType || "",
      flightType: params.tripType || "",
      
    });
    return p.toString();
  };

  const refreshTask = async () => {
    if (refreshState.current.count > 2) {
      clearTimeout(refreshState.current.id);
      Dialog.alert({
        title: t("This page has been on for too long"),
        content: t("Please search for flights again"),
        confirmText: t("confirm"),
        hideCancelButton: true,
        closeOnOverlayClick: false,
        onConfirm: () => {
          navigate("/flightlist?" + getFlightListParams(), { replace: true });
        },
      });
      return;
    }

    const sku = searchParams.get("sku");
    const skuData = new URLSearchParams(atob(sku || ""));
    try {
      await refreshCache({
        IPCC: skuData.get("IPCC") || "",
        tripSearch: getTripSearch(skuData),
      });
    } finally {
      const id = setTimeout(refreshTask, 1000 * 60 * 5);
      refreshState.current = {
        count: refreshState.current.count + 1,
        // @ts-ignore
        id,
      };
    }
  };
  const getDetail = async () => {
    if (!searchParams) return;
    const p = {
      campaign: params.campaign,
      deepLinkTokenId: params.deepLinkTokenId,
      locale: params.locale,
      mktportal: params.mktportal,
      currency: params.currency,
      tripType: params.tripType,
      redisCode: params.redisCode,
      segmentSchema: params.segmentSchema,
      departTime: params.departTime,
      returnTime: params.returnTime,
      adult: params.adult,
      children: params.children,
      infant: params.infant,
      cabinType: params.cabinType,
      depart: params.departCity,
      arrive: params.arriveCity,
      skutype: params.skutype,
      profitId:  params.profitId,
      revenueId: params.revenueId,
      penaltyId: params.penaltyId,
      baggageId: params.baggageId,
      group: params.group,
      IPCC: params.IPCC,
      shoppingId: params.shoppingId,
    };
    console.log(p);
    // 存储searchParams
    const res = await generateShopping(p);
    if (res.status && res.content) {
      setShoppingId(res.content.shoppingId);
      setData(res.content);
    }
  };

  const { flightGroupInfoList = [], policyInfo } = data || {};
  // 渲染相关
  const departInfo = getDepartArriveInfo(flightGroupInfoList[0]);
  const returnInfo = getDepartArriveInfo(
    flightGroupInfoList[flightGroupInfoList.length - 1],
  );

  // 动作相关
  const submitOrder = async () => {
    if (!email || !phone || !name) {
      Notify.warn( t("Please fill in the contact information") );
      return;
    }
    if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)){
      Notify.warn( t("E-mail format is incorrect") );
      return;
    }
    if (!selectedPassengersList || selectedPassengersList.length === 0) {
      Notify.warn( t("Please select passengers") );
      return;
    }
    Toast.show({
      content: t("Booking"),
      icon: "loading",
      duration: 0,
      lockScroll: true,
    });
    const priceNeverChange = await checkFlightPrice();
    if (!priceNeverChange) return;
    const p: ICreateOrderRequestType = {
      mktportal: params.mktportal,
      shoppingId: params.shoppingId,
      contactInfo: {
        contactName: name,
        email,
        phoneArea: region.phoneCode,
        mobilePhone: phone,
        contactTel: null,
      },
      flightPassengerList: selectedPassengersList,
      remark: params.remark,
      locale: params.locale,
      language: params.language,
      channel: "h5",
      revenueId: params.revenueId,
      profitId: params.profitId,
      IPCC: params.IPCC,
      group: params.group,
      skuType: params.skutype,
      baggageInfo: baggageInfo,
    };
    try {
      const {
        content: {
          orderInfo: { orderId },
        },
      } = await booking(p);
      Toast.clear();
      if (orderId) {
        navigate("/payment?id=" + orderId);
      }
    } catch (e) {
      Toast.clear();
      Toast.show({
        content: t("createOrderFail"),
      });
    }
  };

  const getPassengerList = () => {
    const passengerList: IChangePassenger[] = selectedPassengersList.reduce(
      (prev, cur) => {
        if (cur.travelerType === "ADT") {
          prev[0] = {
            name: "Adult",
            count: prev[0].count + 1,
            flag: "ADT",
          };
        }
        if (cur.travelerType === "CHD") {
          prev[1] = {
            name: "Children",
            count: prev[1].count + 1,
            flag: "CHD",
          };
        }
        if (cur.travelerType === "INF") {
          prev[2] = {
            name: "Infant",
            count: prev[2].count + 1,
            flag: "INF",
          };
        }
        return prev;
      },
      [
        {
          name: "Adult",
          count: 0,
          flag: "ADT",
        },
        {
          name: "Children",
          count: 0,
          flag: "CHD",
        },
        {
          name: "Infant",
          count: 0,
          flag: "INF",
        },
      ],
    );

    return passengerList;
  };

  const checkFlightPrice = async () => {
    if (!data) return;
    try{
      const {
        content: { penalty, priceInfo, verifyResult, redisSchema },
      } = await check({
        redisSchema: data.redisSchema,
        redisCode: data.redisCode,
        currency: params.currency || currency,
        shoppingId,
        priceId: data.policyDetailInfo.priceId,
        passengerList: getPassengerList(),
        group: data.group,
        IPCC: data.IPCC,
      });
  
      // 价格没问题
      if (verifyResult === 0) {
        return true;
      }
      // 卖完了
      if (verifyResult === -1) {
        return Dialog.alert({
          title: t("info"),
          content: t("book-info-3"),
          confirmText: t("confirm"),
          hideCancelButton: true,
          closeOnOverlayClick: false,
          onConfirm: () => {
            navigate("/flightlist?" + getFlightListParams(), { replace: true });
          },
        });
      }
      // format价格
      priceInfo.adultPrice = priceFormat(priceInfo.adultPrice);
      priceInfo.childPrice = priceFormat(priceInfo.childPrice);
      priceInfo.infantPrice = priceFormat(priceInfo.infantPrice);
  
      //  价格有问题，弹窗说明
      Dialog.alert({
        title: t("book-info-1"),
        content: t("book-info-2"),
        hideCancelButton: true,
        closeOnOverlayClick: false,
        confirmText: t("confirm"),
      });
      let newData: IShoppingInfo = data;
      if (penalty.length) {
        newData = {
          ...data,
          policyInfo: {
            ...data.policyInfo,
            penaltyInfoList: penalty,
          },
        };
      }
      if (priceInfo?.totalPrice) {
        newData = {
          ...newData,
          policyDetailInfo: priceInfo,
        };
      }
      newData.redisSchema = redisSchema;
      setData(newData);
    }catch(e){
      Toast.show({
        content: t("createOrderFail"),
      });
      return false;
    }
  };

  const onChangeBaggage = (baggage:IBaggage|undefined) =>{
    setBaggageInfo(baggage);
  };

  return (
    <div className="fill-page">
      <div className="fill-docker">
        <div className="fill-city" onClick={() => setShowDetails(true)}>
          {!departInfo ? (
            <Skeleton
              rows={1}
              animated
              className="list-item"
              style={{ display: "block" }}
            />
          ) : (
            <>
              <div className="fill-city-info">
                <div
                  className="fill-city-detail"
                >
                  <Tag type="success" className="fill-type-tag">{flightGroupInfoList.length === 1? t("OW"): t("RT1")}</Tag>
                  <span>{departInfo[0]}</span>-<span>{departInfo[1]}</span>
                  <span>
                    {displayLocaleTime(departInfo[2], EmomentFormatType.Default)}
                  </span>
                </div>
                {flightGroupInfoList.length > 1 && returnInfo && (
                  <div className="fill-city-detail">
                    <Tag type="success">{t("RT2")}</Tag>
                    <span>{returnInfo[0]}</span>-<span>{returnInfo[1]}</span>
                    <span>
                      {displayLocaleTime(
                        returnInfo[2],
                        EmomentFormatType.FULLTIME,
                      )}
                    </span>
                  </div>
                )}
              </div>
              <Right />
            </>
          )}
          <Details
            visible={showDetails}
            onClose={() => setShowDetails(false)}
            flightGroupInfoList={flightGroupInfoList}
          />
        </div>
        {policyInfo && (
          <div className="fill-policy" onClick={() => setShow(true)}>
            <span>
              {t("Policies and Baggage Allowance")}
            </span>
            <Right />
            <Policy
              visible={show}
              onClose={() => setShow(false)}
              policyInfo={policyInfo}
            />
          </div>
        )}
        {
          flightGroupInfoList.length > 0 && (
            <Baggage
              skuType={params.skutype}
              depart={params.departCity}
              arrive={params.arriveCity}
              departTime={params.departTime}
              carrier={flightGroupInfoList}
              currency={params.currency}
              onChange={onChangeBaggage}
            />
          )
        }
        
        <div className="fill-passenger">
          <div className="passenger-title">{t("Passenger")}</div>
          <Passenger departDate={returnInfo?.[2]?.substr(0, 10)} />
        </div>
        <div className="fill-contact">
          <div className="contact-title">{t("Contact Details")}</div>
          <div className="fill-contact-region">
            <My2 />
            <Input
              placeholder={t("Please input your name")}
              clearable
              value={name}
              onChange={(v) => {
                setName(v);
              }}
            />
          </div>
          <div className="fill-contact-region">
            <div className="region-number" onClick={showRegionSelect}>{region.phoneCode}<RectRight style={{marginLeft: "5px"}} /></div>
            <Input
              placeholder={t("enterMobileNumber")}
              clearable
              value={phone}
              type="number"
              onChange={(v) => {
                setPhone(v);
              }}
            />
          </div>
          <div className="fill-contact-region">
            <IconFont fontClassName="iconfont" classPrefix='LLTrip' name="mail" size={"20px"}/>
            <Input
              placeholder={t("Please input your email!")}
              clearable
              value={email}
              onChange={(v) => {
                setEmail(v);
              }}
            />
          </div>
        </div>
      </div>
      <div className="fill-next">
        <PriceDetails
          priceId={data?.policyDetailInfo.priceId}
          addonPrice={baggageInfo?.price}
          defaultPrice={data?.policyDetailInfo.avgPrice}
          submit={submitOrder}
        />
      </div>
    </div>
  );
};

export default FillPage;
