import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchSubTasksApi,
  fetchSubTaskApi,
  createSubTaskApi,
  deleteSubTaskApi,
  updateSubTaskApi,
} from "../../api/api";

const initialState = {
  subTasks: [],
  subTask: null,
  isLoading: false,
  isError: null,
};

// fetch  sub-tasks
export const fetchSubTasks = createAsyncThunk(
  "subtasks/fetch",
  async ({ taskId, token }, { rejectWithValue }) => {
    try {
      const response = await fetchSubTasksApi(taskId, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Single subtask
export const fetchSubTask = createAsyncThunk(
  "subtasks/fetchSingleSubTask",
  async ({ subTaskId, token }, { rejectWithValue }) => {
    try {
      const response = await fetchSubTaskApi(subTaskId, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// create sub Task
export const createSubTask = createAsyncThunk(
  "subtasks/create",
  async ({ taskId, userId, values, token }, { rejectWithValue }) => {
    try {
      const response = await createSubTaskApi(taskId, userId, values, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete sub Task
export const deleteSubTask = createAsyncThunk(
  "subtasks/delete",
  async ({ subTaskId, token }, { rejectWithValue }) => {
    try {
      await deleteSubTaskApi(subTaskId, token);
      return subTaskId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Sub Task
export const updateSubTask = createAsyncThunk(
  "subtasks/update",
  async ({ subTaskId, token, values }, { rejectWithValue }) => {
    try {
      const response = await updateSubTaskApi(subTaskId, token, values);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const subTaskSlice = createSlice({
  name: "subtasks",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubTasks.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchSubTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subTasks = action.payload;
      })
      .addCase(fetchSubTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      })
      .addCase(fetchSubTask.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchSubTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subTask = action.payload;
      })
      .addCase(fetchSubTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      })
      .addCase(createSubTask.pending, (state) => {
        state.isError = null;
        state.isLoading = true;
      })
      .addCase(createSubTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subTasks.unshift(action.payload);
      })
      .addCase(createSubTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      })
      .addCase(deleteSubTask.pending, (state) => {
        state.isError = null;
        state.isLoading = true;
      })
      .addCase(deleteSubTask.fulfilled, (state, action) => {
        const subTaskId = action.payload;
        state.subTasks = state.subTasks.filter(
          (subtask) => subtask.id !== subTaskId
        );
        state.isLoading = false;
        state.isError = null;
      })
      .addCase(deleteSubTask.rejected, (state, action) => {
        state.isError = action.error.message;
        state.isLoading = false;
      })
      .addCase(updateSubTask.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(updateSubTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedSubTask = action.payload;
        const index = state.subTasks.findIndex(
          (subtask) => subtask.id === updatedSubTask.id
        );
        if (index !== -1) {
          state.subTasks[index] = updatedSubTask;
        }
      })
      .addCase(updateSubTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      });
  },
});

export default subTaskSlice.reducer;
