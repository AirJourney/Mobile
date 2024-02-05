import { useMemo } from "react";
import { Button } from "@nutui/nutui-react";
import { Edit, Del } from "@nutui/icons-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@utils/hooks";
import { useTranslation } from "react-i18next";
import { removePassenger } from "@state/passenger";
import { passengersListSelector } from "@state/createSelector/passenger";
import type { IFlightPassengerList } from "@services/orderdetail";
import "./Passenger.less";

interface IPassengerProps {
  readonly?: boolean;
  value?: IFlightPassengerList[];
  departDate?: string;
}
const Passenger = ({ readonly, value, departDate }: IPassengerProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const passengers = useAppSelector((state) => state.passenger.list);
  const selectedPassengersList = useAppSelector(passengersListSelector);
  const certMap = useMemo(() => ({ "Passport": t("Passport") }), [t]);
  const editPassenger = (id: string) => {
    navigate(`/passengerEdit?id=${id}`,{
      state: {
        departDate,
      },
    });
  };

  const getTicketType = (type: string) => {
    switch (type) {
    case "ADT": {
      return t("Adult Ticket");
    }
    case "CHD": {
      return t("Child Ticket");
    }
    case "INF": {
      return t("Infant Ticket");
    }
    default: {
      return "";
    }
    }
  };

  return (
    <>
      {(value || selectedPassengersList).map((item) => {
        return (
          <div className="passenger" key={item.cardNo}>
            {readonly ? null : (
              <Del
                onClick={() => dispatch(removePassenger(item.passengerId))}
              />
            )}
            <div>
              <div className="passenger-name">
                <span>{item.givenName}</span>
                <span>{item.surName}</span>
              </div>
              <div className="passenger-passport">
                <span>{certMap[item.cardType as "Passport"]}</span>
                <span>{item.cardNo}</span>
              </div>
            </div>
            {readonly && <span>{getTicketType(item.travelerType)}</span>}
            {readonly ? null : (
              <Edit onClick={() => editPassenger(item.passengerId)} />
            )}
          </div>
        );
      })}
      {readonly ? null : (
        <Button
          type="primary"
          size="normal"
          style={{
            width: "100%",
            marginTop: "10px",
          }}
          onClick={() =>
            navigate(
              passengers.length > 0 ? "/passengerList" : "/passengerEdit",
              {
                state: {
                  departDate,
                },
              }
            )
          }
        >
          {t("addPassenger")}
        </Button>
      )}
    </>
  );
};

export default Passenger;
