import { Reducer, useEffect, useReducer, useState } from "react";
import {
  Row,
  Col,
  Divider,
  Popup,
  Calendar,
  InputNumber,
  Button,
  ConfigProvider,
  Picker,
  Image
} from "@nutui/nutui-react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { useAppSelector } from "@utils/hooks";
import {
  ECabinType,
  EFlightType,
  EPassengerType,
  TPassenger,
} from "@components/searchForm";
import { Close } from "@nutui/icons-react";
import { getCabinText } from "../../utils/index";
import { useTranslation } from "react-i18next";
import { getCityInfo, getCityName } from "@pages/CityPicker";
import "./index.less";


interface ISearchParams {
  departTime: string;
  returnTime?: string;
  depart: string;
  arrive: string;
  passenger: TPassenger[];
  cabinType: ECabinType;
}

interface IAction {
  type: EAction;
  payload?: any;
}

enum EAction {
  DepartTime,
  ReturnTime,
  Depart,
  Arrive,
  SwapCity,
  Passenger,
  CabinType,
}

const reducer = (state: ISearchParams, action: IAction) => {
  let newState = state;
  switch (action.type) {
  case EAction.DepartTime: {
    newState = {
      ...state,
      departTime: action.payload,
    };
    break;
  }
  case EAction.ReturnTime: {
    newState = {
      ...state,
      returnTime: action.payload,
    };
    break;
  }
  case EAction.Depart: {
    newState = {
      ...state,
      depart: action.payload,
    };
    break;
  }
  case EAction.Arrive: {
    newState = {
      ...state,
      arrive: action.payload,
    };
    break;
  }
  case EAction.SwapCity: {
    newState = {
      ...state,
      depart: state.arrive,
      arrive: state.depart,
    };
    break;
  }
  case EAction.Passenger: {
    newState = {
      ...state,
      passenger: action.payload,
    };
    break;
  }
  default: {
    return state;
  }
  }
  localStorage.setItem("lltrip-search", JSON.stringify(newState));
  return newState;
};

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const locale = useAppSelector((state) => state.commonSetting.language);
  const [isDPopVisible, setIsDPopVisible] = useState(false);
  const [isAPopVisible, setIsAPopVisible] = useState(false);
  const [showPassengerPop, setShowPassengerPop] = useState(false);
  const [isCabinVisible, setIsCabinVisible] = useState(false);
  const CABINLIST = [
    {
      text: t("Economy/Premium Economy1"),
      value: "E",
    },
    {
      text: t("Business/First"),
      value: "B",
    },
  ];
  const [searchForm, dispatch] = useReducer<
			Reducer<ISearchParams, IAction>,
			ISearchParams
			>(reducer,{
			  departTime: moment().format("YYYY-MM-DD"),
			  depart: "",
			  arrive: "",
			    passenger: [
			      { name: "Adult", count: 1, flag: EPassengerType.adult },
			      { name: "Children", count: 0, flag: EPassengerType.child },
			      { name: "Infants", count: 0, flag: EPassengerType.infant },
			    ],
			    cabinType: ECabinType.Economy,
			  },
			  (params) => {
			    const result = localStorage.getItem("lltrip-search");
			    if (!result) return params;
			    return JSON.parse(result);
			  },
			);

  useEffect(() => {
    if (location.state && location.state.from === "CityPopup") {
      if (location.state.isDepartCity) {
        dispatch({ type: EAction.Depart, payload: location.state.data.code });
      } else {
        dispatch({ type: EAction.Arrive, payload: location.state.data.code });
      }
    }
  }, [location.state]);

  const changeCity = () => {
    dispatch({ type: EAction.SwapCity });
  };
  const getCity = (code?: null | string) => {
    if (!code) return "";
    const city = getCityInfo(code);
    return getCityName(locale, city);
  };
  const openDepartSwitch = () => {
    setIsDPopVisible(true);
  };
  const closeDepartSwitch = () => {
    setIsDPopVisible(false);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setDepartChooseValue = (param: any) => {
    dispatch({
      type: EAction.DepartTime,
      payload: param[3].replaceAll("/", "-"),
    });
  };
  const openArriveSwitch = () => {
    setIsAPopVisible(true);
  };
  const closeReturnSwitch = () => {
    setIsAPopVisible(false);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setReturnChooseValue = (param: any) => {
    dispatch({
      type: EAction.ReturnTime,
      payload: param[3].replaceAll("/", "-"),
    });
  };
  const passengerTheme = {
    nutuiInputnumberButtonWidth: "15px",
    nutuiInputnumberButtonHeight: "15px",
    nutuiInputnumberButtonBackgroundColor: "#ffb8b1",
    nutuiInputnumberInputBackgroundColor: "#fff",
    nutuiInputnumberInputFontSize: "10px",
  };
  const onClickPassengerPop = () => {
    setShowPassengerPop(false);
  };

  const onSearchClick = () => {
    const searchParam = new URLSearchParams();
    searchParam.set("departTime", searchForm.departTime);
    searchForm.returnTime && searchParam.set("returnTime", searchForm.returnTime);
    searchParam.set("departCity", searchForm.depart);
    searchParam.set("arriveCity", searchForm.arrive);
    searchParam.set("passenger", JSON.stringify(searchForm.passenger));
    searchParam.set("cabinType", searchForm.cabinType);
    searchParam.set(
      "flightType",
      searchForm.returnTime ? EFlightType.Round : EFlightType.OneWay,
    );
    navigate("/flightlist?" + searchParam.toString());
  };

  return (
    <div className="index_view">
      <div className="inquiry-top-flight">
        <Image
          data-src="//file.40017.cn/international/m/image/home_flight_bg.png?v=20191225"
          src="//file.40017.cn/international/m/image/home_flight_bg.png?v=20191225"
        ></Image>
        <div className="intro">
          <p className="p1">{t("looking for flights?")}</p>
          <p className="p2">{t("save money")}</p>
        </div>
      </div>
      <div className="index-flight">
        <div className="index-content">
          <div className="city-box-page border_b">
            <div className="city-info border_b">
              <p className="tip">{t("Depart")}</p>
              <div
                className="city"
                onClick={() => {
                  navigate("/cityPicker", {
                    state: {
                      from: location.pathname,
                      type: "from",
                      isDepartCity: true,
                    },
                  });
                }}
              >
                <p className="p2 ellipsis">
                  <span>{searchForm.depart}</span>
                </p>
                <p className="p3 ellipsis">{getCity(searchForm.depart)}</p>
              </div>
            </div>
            <Divider
              style={{ color: "#444", borderColor: "#444", opacity: "0.2" }}
            ></Divider>
            <div className="city-info">
              <p className="tip">{t("Arrive")}</p>
              <div
                className="city"
                onClick={() => {
                  navigate("/cityPicker", {
                    state: {
                      from: location.pathname,
                      type: "from",
                      isDepartCity: false,
                    },
                  });
                }}
              >
                <p className="p2 ellipsis">
                  <span>{searchForm.arrive}</span>
                </p>
                <p className="p3 ellipsis">{getCity(searchForm.arrive)}</p>
              </div>
            </div>
            <div className="btn-change" onClick={() => changeCity()}></div>
            <Divider
              style={{ color: "#444", borderColor: "#444", opacity: "0.2" }}
            ></Divider>
          </div>
          <div className="date-info">
            <Row>
              <Col span="12">
                <div className="departure border_b">
                  <p className="title">{t("Departure time")}</p>
                  <div className="day-info" onClick={openDepartSwitch}>
                    <p className="day">
                      {searchForm.departTime || t("Select")}
                    </p>
                  </div>
                  <Calendar
                    autoBackfill
                    visible={isDPopVisible}
                    defaultValue={searchForm.departTime}
                    startDate={moment().format("YYYY-MM-DD")}
                    onClose={closeDepartSwitch}
                    onConfirm={setDepartChooseValue}
                  />
                </div>
                <Divider
                  style={{
                    color: "#444",
                    borderColor: "#444",
                    opacity: "0.2",
                    paddingRight: "16px",
                  }}
                ></Divider>
              </Col>
              <Col span="12">
                <div className="departure border_b">
                  <p className="title">{t("Return time")}</p>
                  <div className="day-info" onClick={openArriveSwitch}>
                    <p className="day">
                      {searchForm.returnTime || t("Book return")}
                    </p>
                  </div>
                  <Calendar
                    autoBackfill
                    visible={isAPopVisible}
                    defaultValue={searchForm.departTime}
                    startDate={searchForm.departTime}
                    onClose={closeReturnSwitch}
                    onConfirm={setReturnChooseValue}
                  />
                  <Close
                    className="departure_close"
                    style={{
                      display: searchForm.returnTime ? "block" : "none",
                    }}
                    onClick={() => {
                      setReturnChooseValue(["", "", "", ""]);
                    }}
                  />
                </div>
                <Divider
                  style={{
                    color: "#444",
                    borderColor: "#444",
                    opacity: "0.2",
                  }}
                ></Divider>
              </Col>
            </Row>
          </div>
          <div className="seat-info">
            <Row>
              <Popup
                round
                visible={showPassengerPop}
                style={{ height: "400px", padding: "20px" }}
                position="bottom"
                onClose={() => {
                  onClickPassengerPop();
                }}
              >
                <div className="passenger-pop">
                  <Col span="24" className="passenger-title">
                    <span className="title">{t("Passenger")}</span>
                  </Col>
                  <Col span="18" className="passenger-content">
                    <Row>
                      <Col span="24">
                        <span className="passenger-text">{t("Adults")}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col span="24">
                        <span className="passenger-desc">{t("older than 12")}</span>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="6" className="passenger-input">
                    <ConfigProvider theme={passengerTheme}>
                      <InputNumber
                        min={
                          searchForm.passenger[1].count + searchForm.passenger[2].count
                        }
                        value={searchForm.passenger[0].count}
                        onChange={(count) => {
                          dispatch({
                            type: EAction.Passenger,
                            payload: [
                              {
                                ...searchForm.passenger[0],
                                count: Number(count),
                              },
                              searchForm.passenger[1],
                              searchForm.passenger[2],
                            ],
                          });
                        }}
                      />
                    </ConfigProvider>
                  </Col>
                  <Col span="18" className="passenger-content">
                    <Row>
                      <Col span="24">
                        <span className="passenger-text">{t("Children")}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col span="24">
                        <span className="passenger-desc">{t("younger than 12")}</span>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="6" className="passenger-input">
                    <ConfigProvider theme={passengerTheme}>
                      <InputNumber
                        max={searchForm.passenger[0].count}
                        min={0}
                        value={searchForm.passenger[1].count}
                        onChange={(count) => {
                          dispatch({
                            type: EAction.Passenger,
                            payload: [
                              searchForm.passenger[0],
                              {
                                ...searchForm.passenger[1],
                                count: Number(count),
                              },
                              searchForm.passenger[2],
                            ],
                          });
                        }}
                      />
                    </ConfigProvider>
                  </Col>
                  <Col span="18" className="passenger-content">
                    <Row>
                      <Col span="24">
                        <span className="passenger-text">{t("Infants")}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col span="24">
                        <span className="passenger-desc">{t("younger than 3")}</span>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="6" className="passenger-input">
                    <ConfigProvider theme={passengerTheme}>
                      <InputNumber
                        max={searchForm.passenger[0].count}
                        min={0}
                        value={searchForm.passenger[2].count}
                        onChange={(count) => {
                          dispatch({
                            type: EAction.Passenger,
                            payload: [
                              searchForm.passenger[0],
                              searchForm.passenger[1],
                              {
                                ...searchForm.passenger[2],
                                count: Number(count),
                              },
                            ],
                          });
                        }}
                      />
                    </ConfigProvider>
                  </Col>
                  <Col span="24" className="passenger-button">
                    <Button
                      size="large"
                      type="primary"
                      onClick={() => {
                        setShowPassengerPop(false);
                      }}
                    >
                      {t("Sure")}	
                    </Button>
                  </Col>
                </div>
              </Popup>
              <Col span="12" className="clearfix">
                <div
                  className="ticket-box border_b"
                  onClick={() => setShowPassengerPop(true)}
                >
                  <div className="ticket-num">
                    <span className="child-num">
                      {searchForm.passenger[0].count}
                    </span>
                    <span className="text">{t("Adults")}</span>
                    <span className="child-num">
                      {searchForm.passenger[1].count}
                    </span>
                    <span className="text">{t("Children")}</span>
                    <span className="child-num">
                      {searchForm.passenger[2].count}
                    </span>
                    <span className="text">{t("Infants")}</span>
                  </div>
                  <span className="icon-ticket"></span>
                </div>
                <Divider
                  style={{
                    color: "#444",
                    borderColor: "#444",
                    opacity: "0.2",
                    paddingRight: "16px",
                  }}
                ></Divider>
              </Col>
              <Col span="12" className="clearfix">
                <Picker
                  visible={isCabinVisible}
                  options={CABINLIST}
                  onConfirm={(value) => {
                    dispatch({
                      type: EAction.CabinType,
                      payload: value,
                    });
                  }}
                  onClose={() => setIsCabinVisible(false)}
                />
                <div
                  className="className-box border_b"
                  onClick={() => {
                    setIsCabinVisible(true);
                  }}
                >
                  <div className="className-detail">
                    <p className="ellipsis">
                      {getCabinText(searchForm.cabinType)}
                    </p>
                  </div>
                  <span className="icon-seat"></span>
                </div>
                <Divider
                  style={{
                    color: "#444",
                    borderColor: "#444",
                    opacity: "0.2",
                    paddingRight: "16px",
                  }}
                ></Divider>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <div className="search">
        <Button type="primary"size="large" onClick={onSearchClick}>{t("Search")}</Button>
      </div>
    </div>
  );
};

export default HomePage;
