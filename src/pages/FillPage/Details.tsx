import FlightDetails from "@components/FlightDetails";
import { IFlightGroupInfo } from "@services/shoppingdetail";
import { Popup } from "@nutui/nutui-react";

interface IDetailsProps {
  visible: boolean;
  onClose: () => void;
  flightGroupInfoList: IFlightGroupInfo[];
}

const Details = ({ flightGroupInfoList, onClose, visible }: IDetailsProps) => {
  return (
    <Popup round position="top" visible={visible} onClose={onClose} style={{ padding: "20px 0"}}>
      <FlightDetails flightGroupInfoList={flightGroupInfoList} />
    </Popup>
  );
};

export default Details;
