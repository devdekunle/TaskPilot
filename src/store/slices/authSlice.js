import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserApi } from "../../api/api";

const initialState = {
  isAuthenticated: false,
  token: null,
  error: null,
  loading: false,
  userData: null,
};

// Generate pending, fulfilled and rejected action types
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (cred, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(cred);
      const data = response.data;
      const token = data.auth_token;
      const userDetails = data.user_details;

      // save token and userdetails to local storage
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_details", JSON.stringify(userDetails));
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.auth_token;
        state.isAuthenticated = true;
        state.error = null;
        state.loading = false;
        state.userData = action.payload.user_details;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.error.message;
        state.userData = null;
      });
  },
});

export default authSlice.reducer;
