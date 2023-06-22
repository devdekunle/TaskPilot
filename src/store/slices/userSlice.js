import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";

import { toast } from "react-toastify";

import { fetchProjectMembersApi, addMemberToTaskApi } from "../../api/usersApi";

const initialState = {
  projectMembers: [],
  taskMembers: [],
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

export const addMemberToTask = createAsyncThunk(
  "project-members/add-member-to-task",
  async ({ userId, taskId, token, values }, { rejectWithValue }) => {
    try {
      const response = await addMemberToTaskApi(userId, taskId, token, values);
      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Member successfully added");
      }

      return response.data;
    } catch (error) {
      console.log(error.message);
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
      })
      .addCase(addMemberToTask.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(addMemberToTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskMembers.unshift(action.payload);
      })
      .addCase(addMemberToTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      });
  },
});

export const selectProjectMembers = createSelector(
  (state) => state.members.projectMembers,
  (projectMembers) => projectMembers
);

export default userSlice.reducer;
