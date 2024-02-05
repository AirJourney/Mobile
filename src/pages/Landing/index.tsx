import { transfer } from "@services/transfer";
import { displayLocaleTime } from "@utils/index";
import { Image } from "@nutui/nutui-react";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const Landing = () => {
  const [searchParam] = useSearchParams();
  const queryParams = useMemo(() => {
    const sku = new URLSearchParams(atob(searchParam.get("sku") || ""));
    return {
      departCity: sku.get("departCity"),
      arriveCity: sku.get("arriveCity"),
      departTime: displayLocaleTime(sku.get("departTime"), "YYYY/MM/DD"),
      returnTime: displayLocaleTime(sku.get("returnTime"), "YYYY/MM/DD"),
      tripType: sku.get("tripType"),
    };
  }, [searchParam]);

  useEffect(() => {
    const getJumpUrl = async (urlParams: string) => {
      let jumpUrl = "https://m.skywingtrip.com/";
      try {
        const { content } = await transfer(urlParams);
        if (content) {
          jumpUrl = content;
        }
      } finally {
        setTimeout(() => {
          window.location.href = jumpUrl;
        }, 3000);
      }
    };
    getJumpUrl(window.location.search);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        fit="scale-down"
        height="100px"
        position="center"
        src="https://www.skywingtrip.com/static/image/transfer/waiting_blue_flight.svg"
      />
      <div>
        {queryParams.departCity}&nbsp;-&nbsp;{queryParams.arriveCity}
      </div>
      <div className="">
        {queryParams.tripType === "RT"
          ? `${queryParams.departTime} - ${queryParams.returnTime}`
          : queryParams.departTime}
      </div>
      <div
        style={{
          marginTop: "1rem",
          fontSize: ".8rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span>Please bear with us!</span>
        <span>We're finalizing your trip details.</span>
      </div>
    </div>
  );
};

export default Landing;
