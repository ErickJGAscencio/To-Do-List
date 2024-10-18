import axios from 'axios';

// Define the BASE_URL
const isDevelopment = import.meta.env.MODE === 'development';
// const myBaseUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_DEPLOY
// const BASE_URL = "http://localhost:8000/todolist";
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

export const registerUser = (username, password, email) => {
  const data = {
    username: username,
    password: password,
    email: email
  };
  const response = axios.post(`${BASE_URL}/register/`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  console.log(response);

  return response
};

export const getUserProfile = (token) => {
  return axios.get(`${BASE_URL}/me/`, {
    headers: {
      'Authorization': `Token ${token}`
    }
  });
};

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

export const createProject = async (projectName, projectDescription, tasks, token) => {
  const data = {
    project_name: projectName,
    description: projectDescription,
    tasks: tasks.map(task => ({ task_name: task }))
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

export const createTask = async (id_project, task_name, subtasks, token) => {
  const data = {
    task_name: task_name,
    description: " ",
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

// SubTasks
export const createSubTask = async (id_task, titleSubTask, descriptionSubTask, token) => {
  const data = {
    task: id_task,
    subtask_name: titleSubTask,
    description: descriptionSubTask
  };

  let response;
  try {
    response = await axios.post(`${BASE_URL}/api/v1/subtasks/`, data, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Error creating subtask '${titleSubTask}':`, error);
    throw error;
  }
};

export const fetchSubTask = async (id_task, token) => {
  return axios.get(`${BASE_URL}/api/v1/subtasks/by_task/`, {
    params: {
      id_task: id_task
    },
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
};

export const deleteSubTask = async (id_subtask, token) => {
  let response;
  try {
    response = await axios.delete(`${BASE_URL}/api/v1/subtasks/delete_subtask/`, {
      params: {
        id_subtask: id_subtask
      },
      headers: {
        'Authorization': `Token ${token}`
      }
    });
  } catch (error) {
    console.error("Error deleting subtask:", error);
    throw error;
  }
  return response;
};

export const updateSubtask = async (id_subtask, updatedData, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/v1/subtasks/update_subtask/`, {
      id_subtask,
      ...updatedData
    }, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating subtask:', error);
    throw error;
  }
};
