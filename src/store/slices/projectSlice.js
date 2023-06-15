import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProjectApi,
  deleteProjectApi,
  fetchProjectsApi,
  updateProjectApi,
  fetchProjectApi,
} from "../../api/api";

const initialState = {
  projects: [],
  project: null,
  projectCount: 0,
  isLoading: false,
  isError: null,
};

// Fetch projects

export const fetchProjects = createAsyncThunk(
  "projects/fetch",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetchProjectsApi(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Single project
export const fetchProject = createAsyncThunk(
  "projects/fetchOneProject",
  async ({ projectId, token }, { rejectWithValue }) => {
    try {
      const response = await fetchProjectApi(projectId, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// create
export const createProject = createAsyncThunk(
  "projects/create",
  async ({ userId, values, token }, { rejectWithValue }) => {
    try {
      const response = await createProjectApi(userId, values, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete
export const deleteProject = createAsyncThunk(
  "projects/delete",
  async ({ projectId, userId, token }, { rejectWithValue }) => {
    try {
      await deleteProjectApi(projectId, userId, token);
      return projectId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ projectId, userId, token, values }, { rejectWithValue }) => {
    try {
      const response = await updateProjectApi(projectId, userId, token, values);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Project Slice
const projectSlice = createSlice({
  name: "projects",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.projects;
        state.projectCount = action.payload.projects_count;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
        state.projectCount = 0;
      })
      .addCase(fetchProject.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.project = action.payload; // update the project field with the fetched object
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      })
      .addCase(createProject.pending, (state) => {
        state.isError = null;
        state.isLoading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      })
      .addCase(deleteProject.pending, (state) => {
        state.isError = null;
        state.isLoading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        const projectId = action.payload;
        state.projects = state.projects.filter(
          (project) => project.id !== projectId
        );
        state.isLoading = false;
        state.isError = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isError = action.error.message;
        state.isLoading = false;
      })
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedProject = action.payload;
        const index = state.projects.findIndex(
          (project) => project.id === updatedProject.id
        );
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.error.message;
      });
  },
});

export default projectSlice.reducer;
