import axios from 'axios';

// Define the BASE_URL
const isDevelopment = import.meta.env.MODE === 'development';
const BASE_URL = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_DEPLOY;

// Authentication
export const loginUser = (username, password) => {
  const data = {
    username: username,
    password: password,
  };
  return axios.post(`${BASE_URL}/login/`, data, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
};

export const registerUser = async (username, password, email) => {
  const data = {
    username: username,
    password: password,
    email: email
  };
  // console.log("URL - " + BASE_URL );
  const response = await axios.post(`${BASE_URL}/register/`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return response
};

export const getUserProfile = (token) => {
  return axios.get(`${BASE_URL}/profile/`, {
    headers: {
      'Authorization': `Token ${token}`
    }
  });
};

export const fetchUsers = (searchQuery) => {
  return axios.get(`${BASE_URL}/api/v1/users/`, {
    params: { search: searchQuery }
  });
}


// Projects
export const fetchProjects = () => {
  return axios.get(`${BASE_URL}/api/v1/projects/`, {});
};

export const fetchProjectsByUser = (userId, token) => {
  return axios.get(`${BASE_URL}/api/v1/projects/by_user/`, {
    params: {
      user_id: userId
    },
    headers: {
      'Authorization': `Token ${token}`
    }
  });
};

export const createProject = async (projectName, projectDescription, color, dateLimit, token) => {
  const data = {
    project_name: projectName,
    description: projectDescription,
    color: color,
    due_date:dateLimit
  };

  let response;
  try {
    response = await axios.post(`${BASE_URL}/api/v1/projects/create_project/`, data, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("Creating project error:", error);
    return { error: "Failed to create project" };
  }

  return response;
};

export const updateProject = async (id_project, updatedData, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/v1/projects/update_project/`, {
      id_project,
      ...updatedData,
    },
      {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (idProject, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/v1/projects/delete_project/`, {
      params: {
        id_project: idProject
      },
      headers: {
        Authorization: `Token ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

// Tasks
export const fetchTasks = async (id_project) => {
  return await axios.get(`${BASE_URL}/api/v1/tasks/`, {
    params: {
      id_project: id_project
    }
  });
};

export const fetchTasksByProject = async (id_project, token) => {
  return await axios.get(`${BASE_URL}/api/v1/tasks/by_project/`, {
    params: {
      id_project: id_project
    },
    headers: {
      'Authorization': `Token ${token}`
    }
  });
};

export const createTask = async (id_project, task_name, descriptionTask, subtasks, token) => {
  const data = {
    task_name: task_name,
    description: descriptionTask,
    id_project: id_project,
    subtasks: subtasks.map(subtask => ({ subtask_name: subtask }))
  };

  let response;
  try {
    response = await axios.post(`${BASE_URL}/api/v1/tasks/create_task/`, data, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
  } catch (error) {
    console.error(`Error creating task '${task_name}':`, error);
    return { error: "Failed to create task" };
  }

  return response;
};

export const updateTask = async (id_task, updatedData, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/v1/tasks/update_task/`, {
      id_task,
      ...updatedData
    },
      {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id_task, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/v1/tasks/delete_task/`, {
      params: {
        id_task: id_task
      },
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    return response;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

//COMMENTS
export const fetchComments = async (id_project, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/comments/by_project/`, {
      params: {
        id_project: id_project
      },
      headers: {
        'Authorization': `Token ${token}`
      }
    })

    return response

  } catch (error) {
    console.error(`Error getting comments.`, error);
    return { error: "Error getting comments." };
  }
};

export const createComment = async (id_project, token, comment) => {
  const data = {
    id_project: id_project,
    comment: comment
  };

  try {
    const response = await axios.post(`${BASE_URL}/api/v1/comments/create_comment/`, data, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    return response;

  } catch (error) {
    console.error(`Error creating comment`, error);
    return { error: "Failed to create comment" };
  }
}