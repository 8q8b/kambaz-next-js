"use client";
import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./courses/reducer";
import modulesReducer from "./courses/[cid]/modules/reducer";
import assignmentsReducer from "./courses/[cid]/assignments/reducer";
import accountReducer from "./account/reducer";
import enrollmentsReducer from "./enrollments/reducer";
const store = configureStore({
 reducer: { coursesReducer, modulesReducer, assignmentsReducer, accountReducer, enrollmentsReducer },
 
});
export type RootState = ReturnType<typeof store.getState>;
export default store;