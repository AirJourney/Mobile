import { THEMECOLOR } from "@constant/index";
import { Cell, Popup } from "@nutui/nutui-react";
import { useState } from "react";
import { Right, Horizontal} from "@nutui/icons-react";
import { ECurrencyType, ELanguageType } from "@constant/enum";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@utils/hooks";
import { changeCurrency, changeLanguage } from "../../state/commonSetting";
import { clearUser } from "../../state/user";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Select from "@components/Select";

const enabledRoute = [
  "/", 
  "/sign",
  "/detaillist",
  "/region",
  "/passengerList",
  "/passengerEdit",
  "/fillPage",
  "/flightlist",
  "/bookPage",
  "/book",
  "/updatepwd",
];

const getLanguage = (locale: ELanguageType) => {
  switch (locale) {
  case ELanguageType.English:
    return "English";
  case ELanguageType.Chinese:
    return "简体中文";
  case ELanguageType.TChinese:
    return "繁体中文";
  }
};

const Menu = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const language = useAppSelector((state) => state.commonSetting.language);
  const currency = useAppSelector((state) => state.commonSetting.currency);
  const userName = useAppSelector((state) => state.user.userName);
  const [show, setShow] = useState(false);
  const back = () => {
    setTimeout(() => {
      setShow(false);
    }, 300);
  };

  const changeSearchParams = (params: [string, string]) => {
    if (searchParams.get(params[0])) {
      searchParams.set(...params);
      setSearchParams(searchParams);
    }
    if(searchParams.get("sku")){
      const sku = new URLSearchParams(atob(searchParams.get("sku") || ""));
      sku.set(...params);
      searchParams.set("sku", btoa(sku.toString()));
      setSearchParams(searchParams);
    }
  };
  const isBookPage = location.pathname === "/book";
  if(!enabledRoute.includes(location.pathname)){
    return null;
  }
  return (
    <>
      <Horizontal 
        width={30}
        height={30}
        color={THEMECOLOR.secondary} 
        onClick={() => {
          setShow(true);
        }} />
      <Popup
        visible={show}
        position="right"
        closeable
        style={{
          background: "#edf0f5",
          padding: "50px 0",
          width: "100%",
          height: "100%",
        }}
        onClose={() => {
          setShow(false);
        }}
      >
        <Cell
          className="nutui-cell--clickable"
          title={userName || t("Sign In/Register")}
          align="center"
          extra={!userName && <Right />}
          onClick={() => {
            !userName && navigate("/sign");
          }}
        />
        {!isBookPage&& <Select
          value={[currency]}
          onConfirm={(_, v: (string|number)[]) => {
            dispatch(changeCurrency(v[0] as ECurrencyType));
            changeSearchParams(["currency", v[0] as ECurrencyType]);
            back();
          }}
          label={`${t("Currency")} :  ${currency}`}
          options={[
            Object.values(ECurrencyType).map((item) => {
              return {
                text: item,
                value: item,
              };
            }),
          ]}
        />}
        <Select
          value={[language]}
          onConfirm={(_, v: (string|number)[]) => {
            dispatch(changeLanguage(v[0] as ELanguageType));
            changeSearchParams(["language", v[0] as ELanguageType]);
            back();
          }}
          label={`${t("Language")} : ${getLanguage(language)}`}
          options={[
            [
              {
                text: "English",
                value: ELanguageType.English,
              },
              {
                text: "繁体中文",
                value: ELanguageType.TChinese,
              },
              {
                text: "简体中文",
                value: ELanguageType.Chinese,
              },
            ],
          ]}
        />
        {userName && (
          <>
            <Cell
              className="nutui-cell--clickable"
              title={t("My Bookings")}
              align="center"
              extra={<Right />}
              onClick={() => {
                setShow(false);
                navigate("/detaillist");
              }}
            />
            <Cell
              className="nutui-cell--clickable"
              title={t("Sign Out")}
              align="center"
              extra={<Right />}
              onClick={() => {
                setShow(false);
                navigate("/");
                dispatch(clearUser());
              }}
            />
            
          </>
        )}
        {/* <Cell
          className="nutui-cell--clickable"
          title={t("Contact Details")}
          align="center"
          description={
            <>
              <div>{t("Email")}: helpdesk@skywingtrip.com</div>
              <div>{t("New Zealand")}: +64 98843137</div>
              <div>{t("Thailand")}: +66 25027422</div>
              <div>{t("Indonesia")}: +62 2150928922</div>
              <div>{t("HongKong")}: +852 38533882</div>
              <div>{t("Singapore")}: +65 31290521</div>
              <div>{t("Australia")}: +61 283173230</div>
              <div>{t("Taiwan")}: +886 277553569</div>
              <div>{t("Malaysia")}: +60 1546000597</div>
            </>
          }
        /> */}
      </Popup>
    </>
  );
};


export default Menu;