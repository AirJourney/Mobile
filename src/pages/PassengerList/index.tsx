import { Button, Checkbox } from "@nutui/nutui-react";
import { Edit } from "@nutui/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import { togglePassenger } from "@state/passenger";
import { useAppDispatch, useAppSelector } from "@utils/hooks";
import { useTranslation } from "react-i18next";
import "./index.less";
import { useMemo } from "react";

const PassengerList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const certMap = useMemo(() => ({ "Passport": t("Passport") }), [t]);
  const passengers = useAppSelector((state) => state.passenger.list);
  const selectId = useAppSelector((state) => state.passenger.selected);

  const save = () => {
    navigate(-1);
  };
  const editPassenger = (id: string) => {
    navigate(`/passengerEdit?id=${id}`);
  };
  return (
    <div className="passenger-list">
      <Button
        type="primary"
        size="normal"
        style={{
          width: "100%",
          marginTop: "10px",
        }}
        onClick={() => navigate("/passengerEdit",{
          state:{departDate: location.state?.departDate},
        })}
      >
        {t("addPassenger")}
      </Button>
      {passengers?.map((item) => {
        return (
          <div className="passenger" key={item.cardNo}>
            <Checkbox
              checked={selectId.includes(item.passengerId)}
              style={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                "--nut-icon-width": "20px",
                "--nut-icon-height": "20px",
              }}
              onChange={() => {
                dispatch(togglePassenger(item.passengerId));
              }}
            />
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
            <Edit
              onClick={() => editPassenger(item.passengerId)}
            />
          </div>
        );
      })}
      <div className="button-passenger-sure">
        <Button type="primary" size="large" onClick={save}>
          {t("save")}
        </Button>
      </div>
    </div>
  );
};

export default PassengerList;
