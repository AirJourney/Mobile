import { createSelector } from "@reduxjs/toolkit";
import { type RootState } from "../store";

export const passengersListSelector = createSelector(
  (state: RootState) => state.passenger.list,
  (state: RootState) => state.passenger.selected,
  (list, selected) => {
    return list.filter((item) => selected.includes(item.passengerId));
  },
);
