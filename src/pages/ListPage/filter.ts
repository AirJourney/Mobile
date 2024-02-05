import {
  SortOrder,
  SortType,
  TimeType,
  FilterType,
  StopsType,
} from "@constant/enum";
import type { TFlightDetailType } from "./Interface";

export const sortList = (
  list: TFlightDetailType[],
  type: SortType,
  order: SortOrder,
) => {
  switch (type) {
  case SortType.PRICE: {
    return list.sort((a, b) => {
      if (order === SortOrder.ASC) {
        return a.policyDetailInfo.avgPrice - b.policyDetailInfo.avgPrice;
      } else {
        return b.policyDetailInfo.avgPrice - a.policyDetailInfo.avgPrice;
      }
    });
  }
  case SortType.DURATION: {
    return list.sort((a, b) => {
      if (order === SortOrder.ASC) {
        return (
          getDuration(a.flightGroupInfoList[0].duration) -
            getDuration(b.flightGroupInfoList[0].duration)
        );
      } else {
        return (
          getDuration(b.flightGroupInfoList[0].duration) -
            getDuration(a.flightGroupInfoList[0].duration)
        );
      }
    });
  }
  case SortType.DEPART: {
    return list.sort((a, b) => {
      if (order === SortOrder.ASC) {
        return (
          new Date(a.flightGroupInfoList[0].departDateTimeFormat).getTime() -
            new Date(b.flightGroupInfoList[0].departDateTimeFormat).getTime()
        );
      } else {
        return (
          new Date(b.flightGroupInfoList[0].departDateTimeFormat).getTime() -
            new Date(a.flightGroupInfoList[0].departDateTimeFormat).getTime()
        );
      }
    });
  }
  case SortType.ARRIVE: {
    return list.sort((a, b) => {
      if (order === SortOrder.ASC) {
        return (
          new Date(a.flightGroupInfoList[a.flightGroupInfoList.length-1].arriveDateTimeFormat).getTime() -
            new Date(b.flightGroupInfoList[b.flightGroupInfoList.length-1].arriveDateTimeFormat).getTime()
        );
      } else {
        return (
          new Date(b.flightGroupInfoList[b.flightGroupInfoList.length-1].arriveDateTimeFormat).getTime() -
            new Date(a.flightGroupInfoList[a.flightGroupInfoList.length-1].arriveDateTimeFormat).getTime()
        );
      }
    });
  }
  default: {
    return list;
  }
  }
};

const getDuration = (dur: { h: string; m: string }) => {
  return Number(dur.h) * 60 + Number(dur.m);
};

export type IFilterType =
  | {
      type: FilterType.DEPART_TIME | FilterType.ARRIVE_TIME;
      value: TimeType[];
    }
  | {
      type:
        | FilterType.AIRPORT_DEPART
        | FilterType.AIRPORT_ARRIVE
        | FilterType.AIRLINE;
      value: string[];
    }
  | {
      type: FilterType.STOPS;
      value: StopsType[];
    };

export const filterList = (list: TFlightDetailType[], type: IFilterType[]) => {
  return list.filter((item) => {
    const flight = item.flightGroupInfoList[0];
    const segments = flight.flightSegments;
    const departTime = new Date(flight.departDateTimeFormat);
    const arriveTime = new Date(flight.arriveDateTimeFormat);
    const departTimeType = getTimeType(departTime);
    const arriveTimeType = getTimeType(arriveTime);
    const departAirport = segments[0].dPortInfo.code;
    const arriveAirport = segments[segments.length - 1].aPortInfo.code;
    // const airline = flight.airlineCode;
    const stops = getStopsType(flight.flightSegments.length);
    let filterResult = true;
    for (const cur of type) {
      if (!filterResult) return filterResult;
      if (cur.value.length === 0) continue;
      switch (cur.type) {
      case FilterType.DEPART_TIME: {
        filterResult = filterResult && cur.value.includes(departTimeType);
        break;
      }
      case FilterType.ARRIVE_TIME: {
        filterResult = filterResult && cur.value.includes(arriveTimeType);
        break;
      }
      case FilterType.AIRPORT_DEPART: {
        filterResult = filterResult && cur.value.includes(departAirport);
        break;
      }
      case FilterType.AIRPORT_ARRIVE: {
        filterResult = filterResult && cur.value.includes(arriveAirport);
        break;
      }
      // case FilterType.AIRLINE: {
      //   filterResult = filterResult && cur.value.includes(airline);
      //   break;
      // }
      case FilterType.STOPS: {
        if (cur.value.includes(StopsType.ANY)) {
          break;
        }
        filterResult = filterResult && cur.value.includes(stops);
        break;
      }
      default: {
        break;
      }
      }
    }
    return filterResult;
  });
};

/**
 * 根据时间获取时间段
 */
const getTimeType = (date: Date) => {
  const hour = date.getHours();
  if (hour >= 0 && hour < 6) {
    return TimeType.DAWN;
  } else if (hour >= 6 && hour < 12) {
    return TimeType.MORNING;
  } else if (hour >= 12 && hour < 18) {
    return TimeType.AFTERNOON;
  } else {
    return TimeType.NIGHT;
  }
};

const getStopsType = (stops: number) => {
  if (stops === 1) {
    return StopsType.NON_STOP;
  } else if (stops === 2) {
    return StopsType.ONE_STOP;
  } else {
    return StopsType.MULTI_STOP;
  }
};
