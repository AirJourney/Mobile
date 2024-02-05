import { useRef, useState } from "react";
import { Cell, Image, Button, Toast } from "@nutui/nutui-react";
// import { useLocation } from "react-router-dom";
// import {
//   allpayxCreateOrder,
// } from "@services/payment";
import { useTranslation } from "react-i18next";

import "./index.less";

const FlightList = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  // const location = useLocation();
  const [checkedMethod, setCheckedMethod] = useState<string>("allpayx");

  const gotoPayment = () => {
    Toast.show({
      content: "demo 无法支付",
      duration: 3,
    });
    // if (checkedMethod === "allpayx") {
    //   allpayx();
    // }
  };

  // const allpayx = async () => {
  //   const id = new URLSearchParams(location.search).get("id");
  //   if (!id) return;
  //   try{
  //     const {
  //       data: { url },
  //     } = await allpayxCreateOrder(id);
  //     if (url) {
  //       window.location.href = url;
  //     }else{
  //       Toast.show({
  //         content: t("createPaymentFail"),
  //         duration: 3,
  //       });
  //     }
  //   }catch(e){
  //     Toast.show({
  //       content: t("createPaymentFail"),
  //       duration: 3,
  //     });
  //   }
  // };

  return (
    <div className="payment-view" ref={ref}>
      <Cell
        title={
          <Image
            className={checkedMethod === "allpayx" ? "checked" : ""}
            src="https://skywingtrip.com/static/image/home/nets.png"
            fit="scale-down"
            height="60"
            position="center"
          />
        }
        onClick={() => setCheckedMethod("allpayx")}
      />
      {checkedMethod !== "" && (
        <Button
          type="primary"
          style={{
            width: "100%",
            height: "2.5rem",
            position: "sticky",
            bottom: "2rem",
          }}
          onClick={gotoPayment}
        >
          {t("Check out")}
        </Button>
      )}
    </div>
  );
};
export default FlightList;
