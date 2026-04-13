import { createSlice } from "@reduxjs/toolkit";

/** Courses the current user is enrolled in (from GET .../enrollments, populated). */
export type EnrolledCourse = { _id: string };

export function isEnrolledInCourse(
  enrolledCourses: EnrolledCourse[],
  courseId: string
): boolean {
  return enrolledCourses.some((c) => String(c._id) === String(courseId));
}

const initialState = {
  enrollments: [] as EnrolledCourse[],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments: (state, action: { payload: EnrolledCourse[] }) => {
      state.enrollments = action.payload;
    },
  },
});

export const { setEnrollments } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
