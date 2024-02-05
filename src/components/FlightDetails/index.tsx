import { Skeleton } from "@nutui/nutui-react";
import { IFlightGroupInfo } from "@services/shoppingdetail";
import FlightGroup from "./FlightGroup";
import "./index.less";

interface IFlightDetailsProps {
  flightGroupInfoList?: IFlightGroupInfo[];
  loading?: boolean;
}
const FlightDetails = ({ flightGroupInfoList, loading }: IFlightDetailsProps) => {
  return (
    <div className="flight-group">
      {loading || !flightGroupInfoList ? (
        <div className="flight-group">
          <Skeleton
            rows={3}
            title
            animated
            className="list-item"
            style={{ display: "block" }}
          />
        </div>
      ) : (
        flightGroupInfoList.map((item, i) => (
          <FlightGroup
            key={item.flightId}
            {...item}
            type={
              flightGroupInfoList.length === 1 ? "OW" : i === 0 ? "RT1" : "RT2"
            }
          />
        ))
      )}
    </div>
  );
};
export default FlightDetails;
