import { Price, Skeleton } from "@nutui/nutui-react";
import { IPolicyDetail } from "@services/shoppingdetail";
import { useAppSelector } from "@utils/hooks";
import { ECurrencyType } from "@constant/enum";
import { useTranslation } from "react-i18next";
import "./PricePanel.less";

const PricePanel = (props: { price?: IPolicyDetail; loading?: boolean }) => {
  const { t } = useTranslation();
  const currency = useAppSelector((state) => state.commonSetting.currency);
  if (!props.price || props.loading) {
    return (
      <Skeleton
        rows={3}
        title
        animated
        className="price-panel"
        style={{ display: "block" }}
      />
    );
  }
  const { adultPrice, childPrice, infantPrice } = props.price;

  return (
    <div className="price-panel">
      <span>{t("Price Per Passenger")}</span>
      <div>
        <span className="price-panel-type">{t("Adults")}</span>
        <Price
          price={Number(adultPrice.salePrice) + Number(adultPrice.tax)}
          size="normal"
          digits={0}
          symbol={ECurrencyType[currency]}
          thousands
        />
      </div>
      <div>
        <span className="price-panel-type">{t("Children")}</span>
        <Price
          price={Number(childPrice.salePrice) + Number(childPrice.tax)}
          size="normal"
          digits={0}
          symbol={ECurrencyType[currency]}
          thousands
        />
      </div>
      {Number(infantPrice.salePrice) > 0 && (
        <div>
          <span className="price-panel-type">{t("Infants")}</span>
          <Price
            price={Number(infantPrice.salePrice) + Number(infantPrice.tax)}
            size="normal"
            digits={0}
            symbol={ECurrencyType[currency]}
            thousands
          />
        </div>
      )}
    </div>
  );
};

export default PricePanel;
