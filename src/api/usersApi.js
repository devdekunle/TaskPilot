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
