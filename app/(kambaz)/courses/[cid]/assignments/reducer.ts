import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignments: [] as any[],
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignments: (state, action: { payload: any[] }) => {
      state.assignments = action.payload;
    },
  },
});

export const { setAssignments } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
