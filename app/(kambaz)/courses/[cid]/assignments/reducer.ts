import { createSlice } from "@reduxjs/toolkit";
import { assignments } from "../../../database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  assignments: assignments as any[],
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, { payload: assignment }: { payload: any }) => {
      const newAssignment = {
        _id: uuidv4(),
        title: assignment.title ?? assignment.name,
        course: assignment.course,
        description: assignment.description ?? "",
        points: assignment.points ?? 100,
        dueDate: assignment.dueDate ?? "",
        availableFrom: assignment.availableFrom ?? "",
        availableUntil: assignment.availableUntil ?? "",
      };
      state.assignments = [...state.assignments, newAssignment];
    },
    deleteAssignment: (state, { payload: assignmentId }: { payload: string }) => {
      state.assignments = state.assignments.filter(
        (a: any) => a._id !== assignmentId
      );
    },
    updateAssignment: (state, { payload: assignment }: { payload: any }) => {
      state.assignments = state.assignments.map((a: any) =>
        a._id === assignment._id ? assignment : a
      );
    },
  },
});

export const { addAssignment, deleteAssignment, updateAssignment } =
  assignmentsSlice.actions;
export default assignmentsSlice.reducer;
