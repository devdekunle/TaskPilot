import axios from "axios";
import { BASE_URL } from "./api";

// Fetch all user's project
export const fetchProjectMembersApi = async (projectId, token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/users/projects/${projectId}`,
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
      `${BASE_URL}/api/v1/users/${userId}/tasks/${taskId}/add`,
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
