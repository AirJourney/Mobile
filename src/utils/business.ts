// 可以复用的业务代码

import { TTripSearch } from "@components/searchForm";

export const getSearchParams = (params: any) => {
  return {
    flightType: params.tripType,
    cabinType: params.cabinType,
    passenger: [
      { name: "Adult", count: Number(params.adult), flag: "ADT" },
      { name: "Children", count: Number(params.children), flag: "CHD" },
      { name: "Infants", count: Number(params.infant), flag: "INF" },
    ],
    tripSearch: [
      params.tripType === "OW"
        ? {
          depart: params.depart,
          arrive: params.arrive,
          departTime: params.departTime?.replace(
            /(\d{4})(\d{2})(\d{2})/,
            "$1-$2-$3",
          ),
        }
        : {
          depart: params.arrive,
          arrive: params.depart,
          departTime: params.returnTime?.replace(
            /(\d{4})(\d{2})(\d{2})/,
            "$1-$2-$3",
          ),
        },
    ],
  };
};

export const getDepartArriveInfo = (params: any) => {
  const { flightSegments } = params||{};
  if(!flightSegments) return null;
  const { dCityInfo, dDateTime } = flightSegments[0];
  const { aCityInfo } = flightSegments[flightSegments.length - 1];
  return [dCityInfo.code, aCityInfo.code, dDateTime];
};

export const getTripSearch = (searchParams: URLSearchParams): TTripSearch[] => {
  const depart = searchParams.get("departCity");
  const arrive = searchParams.get("arriveCity");
  const departTime = searchParams.get("departTime");
  const returnTime = searchParams.get("returnTime");
  if (returnTime) {
    return [
      { depart, arrive, departTime },
      {
        depart: arrive,
        arrive: depart,
        departTime: returnTime,
      },
    ];
  }
  return [{ depart, arrive, departTime }];
};
