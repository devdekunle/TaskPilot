import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import {
  fetchTasksApi,
  createTaskApi,
  deleteTaskApi,
  updateTaskApi,
  fetchTaskApi,
} from "../../api/api";

const initialState = {
  tasks: [],
  task: null,
  isLoading: false,
  isError: null,
};

// fetch  tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async ({ projectId, token }, { rejectWithValue }) => {
    try {
      const response = await fetchTasksApi(projectId, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Single task
export const fetchTask = createAsyncThunk(
  "tasks/fetchOneTask",
  async ({ taskId, token }, { rejectWithValue }) => {
    try {
      const response = await fetchTaskApi(taskId, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// create Task
export const createTask = createAsyncThunk(
  "tasks/create",
  async ({ projectId, userId, values, token }, { rejectWithValue }) => {
    try {
      const response = await createTaskApi(projectId, userId, values, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Task
export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async ({ taskId, userId, token }, { rejectWithValue }) => {
    try {
      await deleteTaskApi(taskId, userId, token);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Task
export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ taskId, userId, token, values }, { rejectWithValue }) => {
    try {
      const response = await updateTaskApi(taskId, userId, token, values);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      })
      .addCase(fetchTask.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.task = action.payload; // update the project field with the fetched object
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      })
      .addCase(createTask.pending, (state) => {
        state.isError = null;
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      })
      .addCase(deleteTask.pending, (state) => {
        state.isError = null;
        state.isLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const taskId = action.payload;
        state.tasks = state.tasks.filter((task) => task.id !== taskId);
        state.isLoading = false;
        state.isError = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isError = action.error.message;
        state.isLoading = false;
      })
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedTask = action.payload;
        const index = state.tasks.findIndex(
          (task) => task.id === updatedTask.id
        );
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      });
  },
});

export const selectFilteredTasks = (filter) =>
  createSelector(
    (state) => state.tasks.tasks, // Input selector: select the tasks array from the state
    (tasks) => tasks.filter((task) => task.status === filter) // Computation: filter tasks based on the provided filter value and return the filtered array
  );

export default taskSlice.reducer;
