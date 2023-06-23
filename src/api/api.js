import axios from "axios";

export const BASE_URL = "https://taskpilot.me";

// Handle User login
export const loginUserApi = async (cred) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, cred);
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetch all user's project
export const fetchProjectsApi = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetch Single Project
export const fetchProjectApi = async (projectId, token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/projects/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Create Project
export const createProjectApi = async (userId, values, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/projects/users/${userId}`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Remove Project
export const deleteProjectApi = async (projectId, userId, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/projects/${projectId}/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Update project
export const updateProjectApi = async (projectId, userId, token, values) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/projects/${projectId}/users/${userId}`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// TASKS APIS
// fetch all user's task
export const fetchTasksApi = async (projectId, token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/projects/${projectId}/tasks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchTaskApi = async (taskId, token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/tasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Create Task
export const createTaskApi = async (projectId, userId, values, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/projects/${projectId}/users/${userId}/tasks`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete Task
export const deleteTaskApi = async (taskId, userId, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/tasks/${taskId}/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Update Tasks
export const updateTaskApi = async (taskId, userId, token, values) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/tasks/${taskId}/users/${userId}`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// SUBTASKS APIS
// fetch all user's sub-task
export const fetchSubTasksApi = async (taskId, token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/tasks/${taskId}/subtasks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetch Single Sub Task
export const fetchSubTaskApi = async (subTaskId, token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/subtasks/${subTaskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Create Sub Task
export const createSubTaskApi = async (taskId, userId, values, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/tasks/${taskId}/users/${userId}/subtasks`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Delete Sub-Task
export const deleteSubTaskApi = async (subTaskId, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/api/v1/subtasks/${subTaskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Update Sub Tasks
export const updateSubTaskApi = async (subTaskId, token, values) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/subtasks/${subTaskId}`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};
