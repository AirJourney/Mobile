import { EmomentFormatType } from "@constant/enum";
import { ISegmentInfo } from "@services/shoppingdetail";
import { displayLocaleTime, getAirlineLogo } from "@utils/index";
import "./FlightSegment.less";
import { getAirportNameByCode } from "@pages/CityPicker";
import { useAppSelector } from "@utils/hooks";

const FlightSegment = (props: ISegmentInfo) => {
  const locale = useAppSelector((state) => state.commonSetting.language);
  return (
    <>
      <div className="segment">
        <div className="segment-top">
          <div className="segment-detail">
            <span className="segment-time-port">
              <span>
                {displayLocaleTime(props.dDateTime, EmomentFormatType.TIME)}
              </span>
              <span>{props.dPortInfo.code}</span>
            </span>
          </div>
          <span className="arrow-icon"></span>
          <div className="segment-detail">
            <span className="segment-time-port">
              <span>
                {displayLocaleTime(props.aDateTime, EmomentFormatType.TIME)}
                {props.acrossDays > 0 && (
                  <span className="across-days">+{props.acrossDays}D</span>
                )}
              </span>
              <span>{props.aPortInfo.code}</span>
            </span>
          </div>
        </div>
        <div className="segment-bottom">
          <div className="segment-port">
            <span>
              {getAirportNameByCode(locale,props.dPortInfo.code)}{" "}
              {props.dPortInfo.terminal}
            </span>
          </div>
          <div className="segment-port">
            <span>
              <span>
                {getAirportNameByCode(locale,props.aPortInfo.code)}{" "}
                {props.aPortInfo.terminal}
              </span>
            </span>
          </div>
        </div>
        <div className="airline-info">
          <img
            src={getAirlineLogo(props.airlineInfo)}
            style={{
              width: "35px",
              height: "35px",
              objectPosition: "center center",
            }}
          ></img>
          <span className="airline-name">
            <span>{props.airlineInfo.name}</span>
            <span>{props.flightNo}</span>
          </span>
          {props.craftInfo.craftType && props.craftInfo.name && (
            <div>
              <span className="airline-flightno">
                {props.craftInfo.craftType}
              </span>
              <span className="craft-name">{props.craftInfo.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* {props.transferDurationInfo && props.transferDurationInfo !== "null" && (
        <div className="transfer">
          {`${props.transferDurationInfo.hour}h${
            props.transferDurationInfo.min
          }m ${t("Transfer in")} ${props.aCityInfo.name}`}
        </div>
      )} */}
    </>
  );
};
export default FlightSegment;
