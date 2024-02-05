import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import poi from "@constant/data/poi.json";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@utils/hooks";
import SearchPicker from "./SearchPicker";
import "./index.less";
import SearchResult from "./SearchResult";

const hotCityCode = {
  Asia: ["HKG", "MFM", "TPE", "TYO", "OSA", "SHA", "SIN", "SZX"],
  Europe: ["LON", "PAR", "ROM", "FRA", "BER", "MAD", "BCN"],
  "North America": ["NYC", "SFO", "LAX", "YVR", "YTO"],
  Other: ["SYD", "MEL"],
};

export type IAirport  = {
  countrycode: string;
  citycode: string;
  airportcode: string;
} & Record<"cn"|"en"|"tc", {
  countryname: string;
  cityname:  string;
  airportname: string;
}>;

export const getCityName = (locale: "cn"|"tc"|"en", airport?: IAirport) => {
  const enabledLanguage = [ "tc", "en", "cn" ];
  if (!enabledLanguage.includes(locale)) {
    locale = "en";
  }
  if(!airport) return "";
  return airport[locale].cityname;
};

export const getAirportName = (locale: "cn"|"tc"|"en", airport?: IAirport) => {
  const enabledLanguage = [ "tc", "en", "cn" ];
  if (!enabledLanguage.includes(locale)) {
    locale = "en";
  }
  if(!airport) return "";
  return airport[locale].airportname;
};

export const getAirportNameByCode = (locale: "cn"|"tc"|"en", code: string) => {
  const enabledLanguage = [ "tc", "en", "cn" ];
  if (!enabledLanguage.includes(locale)) {
    locale = "en";
  }
  const airport = poi.find((item) => item.airportcode === code);
  if(!airport) return "";
  return airport[locale].airportname;
};

export const getCityInfo = (code: string) => {
  let res = poi.find((city) => city.citycode === code);
  if(!res) res= poi.find((city) => city.airportcode === code);
  return res;
};

const getHotCitiesInfo = () => {
  const hotCities = Object.values(hotCityCode).flat();
  const hotCitiesInfo: Record<string, IAirport> = {};
  let lastCityCode = "";
  for (const city of poi) {
    if (city.citycode !== lastCityCode) {
      lastCityCode = city.citycode;
      if(hotCities.includes(city.citycode)){
        hotCitiesInfo[city.citycode] = city;
      }
    }
  }
  return hotCitiesInfo;
};

const CityPicker = () => {
  const locale = useAppSelector((state) => state.commonSetting.language);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [hotCitiesInfo, setHotCitiesInfo]= useState<Record<string, IAirport>>({});
  const [searchValue, setSearchValue] = useState<string>();

  useMemo(() => {
    setHotCitiesInfo(getHotCitiesInfo());
  }, []);
  
  const renderItem = ({ area, cities }:{cities: string[], area: string}) => {
    return (
      <div className="area-panel" key={area}>
        <span className="area-name">{t(area)}</span>
        <div className="area-cities">
          {cities.map((code) => {
            const city = hotCitiesInfo[code];
            const name = city[locale].cityname;
            return (
              <span
                className="area-city"
                key={code}
                onClick={() => {
                  navigate(location.state.from, {
                    state: {
                      data: { name, code },
                      type: location.state.type,
                      from: "CityPopup",
                      isDepartCity: location.state.isDepartCity,
                    },
                  });
                }}
              >
                {name}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  const onCancelSearchPick = () => {
    navigate(location.state?.from || "/");
  };

  const onSelect = (city: IAirport, type: "city"|"airport") => {
    navigate(location.state?.from || "/", {
      state: {
        data: type==="city"?{
          name: city[locale].cityname,
          code: city.citycode,
        }:{
          name: city[locale].airportname,
          code: city.airportcode,
        },
        type: location.state?.type,
        from: "CityPopup",
        isDepartCity: location.state.isDepartCity,
      },
    });
  };
  return (
    <div className="city-picker">
      <SearchPicker
        value={searchValue}
        onChange={(v) => setSearchValue(v)}
        onCancel={onCancelSearchPick}
        placeholder={t("Search")}
      />
      
      <div className="areas-panel">
        {!searchValue || searchValue?.length === 0 ?  
          Object.keys(hotCitiesInfo).length > 0 && (
            <div className="areas-panel-docker">
              {Object.entries(hotCityCode).map(([area,cities]) => {
                return renderItem({ area, cities });
              })}
            </div>
          )
          : (
            <div>
              <SearchResult keyWords={searchValue} onSelect={onSelect} />
            </div>
          )}
      </div>
    </div>
  );
};

export default CityPicker;
