import { IFlightGroupInfo } from "@services/shoppingdetail";
import { EmomentFormatType } from "@constant/enum";
import { Tag } from "@nutui/nutui-react";
import { displayLocaleTime } from "@utils/index";
import { useTranslation } from "react-i18next";
import FlightSegment from "./FlightSegment";
import "./FlightGroup.less";

type FlightGroupProps = IFlightGroupInfo & { type: "OW" | "RT1" | "RT2" };
const FlightGroup = (props: FlightGroupProps) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flight-time-info" key="aa">
        <Tag type="success">{t(props.type)}</Tag>
        <span>
          {displayLocaleTime(
            props.departDateTimeFormat,
            EmomentFormatType.Default,
          )}
        </span>
        {/* <span>{`${props.duration.h}h${props.duration.m}m`}</span> */}
      </div>
      {props.flightSegments.map((item) => (
        <FlightSegment key={item.segmentNo} {...item} />
      ))}
    </>
  );
};
export default FlightGroup;
