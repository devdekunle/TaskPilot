import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";

import { fetchProjectMembersApi } from "../../api/usersApi";

const initialState = {
  projectMembers: [],
  isLoading: false,
  isError: null,
};

// fetch  tasks
export const fetchProjectMembers = createAsyncThunk(
  "project-members/fetch",
  async ({ projectId, token }, { rejectWithValue }) => {
    try {
      const response = await fetchProjectMembersApi(projectId, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "project-members",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectMembers.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchProjectMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projectMembers = action.payload;
      })
      .addCase(fetchProjectMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      });
  },
});

export default userSlice.reducer;
