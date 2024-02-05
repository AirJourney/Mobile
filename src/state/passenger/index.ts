import { EPassengerType } from "@constant/enum";
import type { IPassenger } from "../../../types/type";
import {
  createSlice,
  CaseReducer,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";

interface PassengerSlice {
  list: IPassenger[];
  selected: string[];
}

interface PassengerSliceAction extends SliceCaseReducers<PassengerSlice> {
  setPassengerList: CaseReducer<PassengerSlice, PayloadAction<IPassenger[]>>;
  updatePassenger: CaseReducer<PassengerSlice, PayloadAction<IPassenger>>;
  removePassenger: CaseReducer<PassengerSlice, PayloadAction<string>>;
  selectPassenger: CaseReducer<PassengerSlice, PayloadAction<string>>;
  unselectPassenger: CaseReducer<PassengerSlice, PayloadAction<string>>;
  togglePassenger: CaseReducer<PassengerSlice, PayloadAction<string>>;
}

const initialState: PassengerSlice = {
  list: [],
  selected: [],
};

const getType = (birthDate: string) => {
  const birth = new Date(birthDate).getTime();
  const now = new Date().getTime();
  const age = (now - birth) / 1000 / 60 / 60 / 24 / 365;
  let passengerType: EPassengerType;
  if (age < 12) {
    passengerType = EPassengerType.child;
  } else if (age < 2) {
    passengerType = EPassengerType.infant;
  } else {
    passengerType = EPassengerType.adult;
  }
  return passengerType;
};

export const passengerSlice = createSlice<PassengerSlice, PassengerSliceAction>(
  {
    name: "passenger",
    initialState,
    reducers: {
      setPassengerList: (state, action) => {
        state.list = action.payload;
      },
      updatePassenger: (state, action) => {
        action.payload = {
          ...action.payload,
          travelerType: getType(action.payload.birthDay),
        };
        // 检查是否已经存在
        if (
          state.list.find(
            (item) => item.passengerId === action.payload.passengerId,
          )
        ) {
          // 修改
          state.list = state.list.map((item) => {
            if (item.passengerId === action.payload.passengerId) {
              return action.payload;
            }
            return item;
          });
        } else {
          state.list.push({ ...action.payload });
        }
        if (state.selected.includes(action.payload.passengerId)) return;
        state.selected.push(action.payload.passengerId);
      },
      removePassenger: (state, action) => {
        state.list = state.list.filter(
          (item) => item.passengerId !== action.payload,
        );
      },
      selectPassenger: (state, action) => {
        if (state.selected.includes(action.payload)) return;
        state.selected.push(action.payload);
      },
      unselectPassenger: (state, action) => {
        state.selected = state.selected.filter(
          (item) => item !== action.payload,
        );
      },
      togglePassenger: (state, action) => {
        if (state.selected.includes(action.payload)) {
          state.selected = state.selected.filter(
            (item) => item !== action.payload,
          );
        } else {
          state.selected.push(action.payload);
        }
      },
    },
  },
);

export const {
  setPassengerList,
  updatePassenger,
  removePassenger,
  selectPassenger,
  unselectPassenger,
  togglePassenger,
} = passengerSlice.actions;
export default passengerSlice.reducer;
