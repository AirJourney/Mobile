import { Popup, Dialog, Button, Price } from "@nutui/nutui-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  IChangePassenger,
  IChangePriceContent,
  IPriceInfo,
  changePrice,
} from "@services/changeprice";
import { useAppSelector } from "@utils/hooks";
import { useTranslation } from "react-i18next";
import { passengersListSelector } from "@state/createSelector/passenger";
import { EPassengerType } from "@constant/enum";
import "./PriceDetails.less";
import { Tips } from "@nutui/icons-react";

interface IPriceDetailsProps {
  priceId?: string;
  submit?: () => void;
  addonPrice?: string;
  defaultPrice?: string;
}

const PriceDetails = ({ priceId, submit, defaultPrice, addonPrice}: IPriceDetailsProps) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const sku = new URLSearchParams(atob(searchParams.get("sku") || ""));
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [priceInfo, setPriceInfo] = useState<IChangePriceContent | null>();
  const [passengerCount, setPassengerCount] = useState({
    adult: 0,
    child: 0,
    infant: 0,
  });
  const selectedPassengersList = useAppSelector(passengersListSelector);

  useEffect(() => {
    if (!selectedPassengersList) return;
    const passengerC = selectedPassengersList.reduce(
      (prev, cur) => {
        return {
          adult:
            prev.adult + (cur.travelerType === EPassengerType.adult ? 1 : 0),
          child:
            prev.child + (cur.travelerType === EPassengerType.child ? 1 : 0),
          infant:
            prev.infant + (cur.travelerType === EPassengerType.infant ? 1 : 0),
        };
      },
      {
        adult: 0,
        child: 0,
        infant: 0,
      },
    );
    setPassengerCount(passengerC);
  }, [selectedPassengersList]);

  const getChangePassenger = () => {
    const passengerList: IChangePassenger[] = [];
    if (passengerCount.adult) {
      passengerList.push({
        name: "Adult",
        count: passengerCount.adult,
        flag: "ADT",
      });
    }
    if (passengerCount.child) {
      passengerList.push({
        name: "Children",
        count: passengerCount.child,
        flag: "CHD",
      });
    }
    if (passengerCount.infant) {
      passengerList.push({
        name: "Infant",
        count: passengerCount.infant,
        flag: "INF",
      });
    }
    return passengerList;
  };

  useEffect(() => {
    const getPriceInfo = async () => {
      if (!priceId) return;
      const passengerList = getChangePassenger();
      if (passengerList.length === 0) {
        setPriceInfo(null);
        return;
      }
      const res = await changePrice({
        changePassenger: passengerList,
        priceId: priceId,
      });
      if (res.status && res.content) {
        if (res.content.priceId !== priceId) {
          Dialog.alert({
            title: "价格发生变动",
            content: "机票价格发生变动，请重新查询",
            hideCancelButton: true,
            confirmText: t("Sure"),
            onConfirm() {
              navigate("/flightlist?" + searchParams.toString());
            },
          });

          return;
        }
        setPriceInfo(res.content);
      }
    };
    getPriceInfo();
  }, [priceId, passengerCount]);

  const renderPriceItem = (
    priceDetail: IPriceInfo,
    count: number,
    type: EPassengerType,
  ) => {
    if (count < 1 || !priceDetail) return null;
    let typeName;
    switch (type) {
    case EPassengerType.child: {
      typeName = t("Child Ticket");
      break;
    }
    case EPassengerType.infant: {
      typeName = t("Infant Ticket");
      break;
    }
    default: {
      typeName = t("Adult Ticket");
    }
    }
    return (
      <div className="price-details-item">
        <div className="price-details-summary">
          <span>{typeName}</span>
          <Price
            symbol={sku.get("currency")||""}
            price={Number(priceDetail.salePrice) + Number(priceDetail.tax)}
            digits={0}
            size="normal"
            thousands
          />
          <span>{count}</span>
        </div>
        <div className="price-details">
          <span>{t("Tax")}</span>
          <Price
            symbol={sku.get("currency")||""}
            price={priceDetail.tax}
            digits={0}
            size="normal"
            thousands
          />
        </div>
        <div className="price-details">
          <span>{t("price")}</span>
          <Price
            symbol={sku.get("currency")||""}
            price={priceDetail.salePrice}
            digits={0}
            size="normal"
            thousands
          />
        </div>
      </div>
    );
  };

  const renderBaggage = ()=>{
    if(!addonPrice) return null;
    return (
      <div className="price-details-item">
        <div className="price-details-summary">
          <span>行李额</span>
          <Price
            symbol={sku.get("currency")||""}
            price={addonPrice}
            digits={0}
            size="normal"
            thousands
          />
        </div>
      </div>);
  };

  const calcTotalPrice = (price?: string| number) => {
    if(typeof price !== "string" && typeof price !== "number") return undefined;
    return Number(price) + Number(addonPrice || 0);
  };

  return (
    <div className="search">
      {priceInfo ? (
        <>
          <div className="summary-price" onClick={() => setVisible(true)}>
            <Price
              symbol={sku.get("currency")||""}
              price={calcTotalPrice(priceInfo.totalPrice)}
              digits={0}
              size="large"
              thousands
            />
            <Tips style={{marginLeft: "5px"}} />
          </div>
          <Popup
            round
            position="bottom"
            visible={visible}
            onClose={() => setVisible(false)}
            style={{
              padding: "20px",
            }}
          >
            <div>
              {renderPriceItem(
                priceInfo.adultPrice,
                passengerCount.adult,
                EPassengerType.adult,
              )}
              {renderPriceItem(
                priceInfo.childPrice,
                passengerCount.child,
                EPassengerType.child,
              )}
              {renderPriceItem(
                priceInfo.infantPrice,
                passengerCount.infant,
                EPassengerType.infant,
              )}
              {renderBaggage()}
            </div>
            <div className="summary-price-inner">
              <Price
                symbol={sku.get("currency")||""}
                price={calcTotalPrice(priceInfo.totalPrice)}
                digits={0}
                size="large"
                thousands
              />
              <Button
                type="primary"
                size="normal"
                onClick={submit}
              >
                {t("next")}
              </Button>
            </div>
          </Popup>
        </>
      ) : (
        <div className="summary-price">
          <span className="summary-tips">{t("avgPrice")}</span>
          <Price
            symbol={sku.get("currency")||""}
            price={calcTotalPrice(defaultPrice)||"---"}
            digits={0}
            size="large"
          />
        </div>
      )}
      <Button
        type="primary"
        size="normal"
        onClick={submit}
      >
        {t("next")}
      </Button>
    </div>
  );
};

export default PriceDetails;