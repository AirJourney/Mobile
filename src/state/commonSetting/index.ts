import { ECurrencyType, ELanguageType } from "@constant/enum";
import { ICommonSetting } from "../../../types/type";
import {
  createSlice,
  CaseReducer,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import i18n from "../../i18n";

interface PassengerSliceAction extends SliceCaseReducers<ICommonSetting> {
  changeLanguage: CaseReducer<ICommonSetting, PayloadAction<ELanguageType>>;
  changeCurrency: CaseReducer<ICommonSetting, PayloadAction<ECurrencyType>>;
  changeSessionId: CaseReducer<
    ICommonSetting,
    PayloadAction<string | undefined>
  >;
  changeUserid: CaseReducer<ICommonSetting, PayloadAction<string | undefined>>;
}

export const initialState: ICommonSetting =  {
  language: ELanguageType.TChinese,
  currency: ECurrencyType.HKD,
  sessionId: undefined,
  userid: undefined,
};

export const commonSettingSlice = createSlice<
  ICommonSetting,
  PassengerSliceAction
>({
  name: "commonSetting",
  initialState,
  reducers: {
    changeLanguage: (state, action) => {
      state.language = action.payload;
      i18n.changeLanguage(action.payload);
      localStorage.setItem("llt-headData", JSON.stringify(state));
    },
    changeCurrency: (state, action) => {
      state.currency = action.payload;
      localStorage.setItem("llt-headData", JSON.stringify(state));
    },
    changeSessionId: (state, action) => {
      state.sessionId = action.payload;
      localStorage.setItem("llt-headData", JSON.stringify(state));
    },
    changeUserid: (state, action) => {
      state.userid = action.payload;
      localStorage.setItem("llt-headData", JSON.stringify(state));
    },
  },
});

export const { changeLanguage, changeCurrency, changeSessionId, changeUserid } =
  commonSettingSlice.actions;

export default commonSettingSlice.reducer;
