import axios from "axios";

// Fetch all user's project
export const fetchProjectMembersApi = async (projectId, token) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:5000/api/v1/users/projects/${projectId}`,
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

export const addMemberToTaskApi = async (userId, taskId, token, values) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:5000/api/v1/users/${userId}/tasks/${taskId}/add`,
      values,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
