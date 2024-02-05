import { store } from "./store";

const curData: any = {};
const listener = () => {
  const prevData: any = { ...curData };
  const storeData = store.getState();
  curData.passenger = storeData.passenger;
  curData.commonSetting = storeData.commonSetting;
  if (prevData.passenger !== curData.passenger) {
    sessionStorage.setItem(
      "passenger",
      JSON.stringify(store.getState().passenger),
    );
  }
  if (prevData.commonSetting !== curData.commonSetting) {
    localStorage.setItem(
      "llt-headData",
      JSON.stringify(store.getState().commonSetting),
    );
  }
};

export const loadFromLocalStorage = () => {
  const result: any = {};
  const passenger = sessionStorage.getItem("passenger");
  const commonSetting = localStorage.getItem("llt-headData");
  if (passenger !== null) {
    result.passenger = JSON.parse(passenger);
  }
  if (commonSetting !== null) {
    result.commonSetting = JSON.parse(commonSetting);
  }
  return result;
};

export default listener;
