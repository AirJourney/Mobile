import { AirlineInfo } from "@constant/Interface";
import i18next from "i18next";
import moment from "moment";

export const getCabinText = (cabin: string) => {
  switch (cabin) {
  case "E":
    return i18next.t("Economy/Premium Economy"); //"经济舱/特经"
  case "B":
    return i18next.t("Business/First");// "商务舱/头等舱";
  default:
    return i18next.t("Economy/Premium Economy");
  }
};

export const getAirlineLogo = (airlineInfo: AirlineInfo) => {
  return `http://skywingtrip.com/static/image/airlogo/${airlineInfo.name.toUpperCase()}.png`;
};

export const getCityImageByCityCode = (companyCode: string, type?: number) => {
  return `http://skywingtrip.com/static/image/city/${companyCode.toUpperCase()}_${
    type ? "750_500" : "960_210"
  }.jpg`;
};

/**
 * 删除对象中为空的属性
 * @returns
 */
export const removeEmpty = <T extends Record<string, any>>(
  obj: T,
): Partial<T> => {
  Object.keys(obj).forEach((key) => {
    if (!obj[key]) delete obj[key];
  });
  return obj;
};

// 使用moment.js 直接格式化目标时区的时间
export const displayLocaleTime = (time?: string | null, format?: string) => {
  const timeInfo = moment.parseZone(time);
  return timeInfo
    .utcOffset(timeInfo.format("Z"))
    .format(format || "YYYY-MM-DD HH:mm");
};
