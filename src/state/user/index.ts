import cookie from "react-cookies";
import {
  CaseReducer,
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";

export interface IUserInfo {
  email: string;
  userName: string;
  valid: boolean;
}
const initialState: IUserInfo = cookie.load("userInfo") || {
  userName: "",
  email: "",
  valid: false,
};

interface UserSliceAction extends SliceCaseReducers<IUserInfo> {
  clearUser: CaseReducer<IUserInfo, PayloadAction<void>>;
  setUser: CaseReducer<IUserInfo, PayloadAction<IUserInfo>>;
}

export const userSlice = createSlice<IUserInfo, UserSliceAction>({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.email = "";
      state.userName = "";
      state.valid = false;
      cookie.remove("userInfo");
    },
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.userName = action.payload.userName;
      state.valid = action.payload.valid;
      cookie.save("userInfo", action.payload, { path: "/" });
    },
  },
});

export const { clearUser, setUser } = userSlice.actions;
export default userSlice.reducer;
