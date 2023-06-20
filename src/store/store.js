import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import projectReducer from "./slices/projectSlice";
import taskReducer from "./slices/taskSlice";
import subTaskSlice from "./slices/subTaskSlice";
import userReducer from "./slices/userSlice";

// Help to persist user login
const authToken = localStorage.getItem("auth_token");
const userDetails = localStorage.getItem("user_details");

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    subTasks: subTaskSlice,
    members: userReducer,
  },
  preloadedState: {
    auth: {
      isAuthenticated: !!authToken,
      token: authToken,
      userData: userDetails ? JSON.parse(userDetails) : null,
    },
  },
});
