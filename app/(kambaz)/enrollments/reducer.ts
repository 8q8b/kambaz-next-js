import { createSlice } from "@reduxjs/toolkit";
import { enrollments as initialEnrollments } from "../database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  enrollments: initialEnrollments as { _id: string; user: string; course: string }[],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    addEnrollment: (
      state,
      { payload }: { payload: { user: string; course: string } }
    ) => {
      const exists = state.enrollments.some(
        (e) => e.user === payload.user && e.course === payload.course
      );
      if (!exists) {
        state.enrollments = [
          ...state.enrollments,
          { _id: uuidv4(), user: payload.user, course: payload.course },
        ];
      }
    },
    removeEnrollment: (
      state,
      { payload }: { payload: { user: string; course: string } }
    ) => {
      state.enrollments = state.enrollments.filter(
        (e) => !(e.user === payload.user && e.course === payload.course)
      );
    },
  },
});

export const { addEnrollment, removeEnrollment } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
