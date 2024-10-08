import axios from 'axios';

// Autentication
export const loginUser = (username, password) => {
  const data = {
    username: username,
    password: password,
  };
  return axios.post("http://localhost:8000/todolist/login/", data, {
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
  return axios.post("http://127.0.0.1:8000/todolist/register/", data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const getUserProfile = (token) => {
  return axios.get("http://localhost:8000/todolist/me/", {
    headers: {
      'Authorization': `Token ${token}`
    }
  });
};

// Projects
export const fetchProjects = () => {
  return axios.get(`http://localhost:8000/todolist/api/v1/projects/`, {
  });
}

export const fetchProjectsByUser = (userId, token) => {
  return axios.get(`http://localhost:8000/todolist/api/v1/projects/by_user/`, {
    params: {
      user_id: userId
    },
    headers: {
      'Authorization': `Token ${token}`
    }
  });
};

export const createProject = async (projectName, projectDescription, tasks, token) => {

  console.log(tasks);
  const data = {
    project_name: projectName,
    description: projectDescription,
    tasks: tasks.map(task => ({ task_name: task }))//convertimos la cadena a nun diccionario
  };

  let response;
  try {
    response = await axios.post("http://localhost:8000/todolist/api/v1/projects/create_project/", data, {
      headers: {
        Authorization: `Token ${token}`,
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
    const response = await axios.put("http://localhost:8000/todolist/api/v1/projects/update_project/", {
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
    const response = await axios.delete(`http://localhost:8000/todolist/api/v1/projects/delete_project/`, {
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
export const fetchTasks = async (id_project, token) => {
  return await axios.get(`http://localhost:8000/todolist/api/v1/tasks/`, {
    params: {
      id_project: id_project
    },
    headers: {
      'Authorization': `Token ${token}`
    }
  });
}

export const fetchTasksByProject = async (id_project, token) => {
  return await axios.get(`http://localhost:8000/todolist/api/v1/tasks/by_project/`, {
    params: {
      id_project: id_project
    },
    headers: {
      'Authorization': `Token ${token}`
    }
  });
}

export const createTask = async (id_project, task_name, subtasks) => {
  const data = {
    task_name: task_name,
    project: id_project,
    description: "provicional"
  };

  let response;
  try {
    response = await axios.post("http://localhost:8000/todolist/api/v1/tasks/", data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log("Response from API:", response.data);

  } catch (error) {
    console.error(`Error creating task '${task_name}':`, error);
    throw error;
  }

  if (!response || !response.data || !response.data.id) {
    console.error("Invalid task creation response:", response);
    return { error: "Invalid task creation response" };
  }

  const id_task = response.data.id;

  if (!subtasks || subtasks.length === 0) {
    return response; // Retornae solo el proyecto si no hay subtareas.
  }

  try {
    await Promise.all(
      subtasks.map((subtask) => createSubTask(id_task, subtask, "ASD"))
    );
  } catch (error) {
    console.error("Creating subtasks error:", error);
    return { error: "Failed to create subtasks" };
  }


  return response;
}

export const updateTask = async (id_task, updatedData) => {
  try {
    const response = await axios.put("http://localhost:8000/todolist/api/v1/tasks/update_task/", {
      id_task,
      ...updatedData
    });
    console.log("API");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

export const deleteTask = async (id_task, token) => {

  //Verify if this task has subtasks
  let responseFP = await fetchSubTask(id_task, token);

  if (responseFP.data.length > 0) {
    console.log("Si tiene subtareas");
    const subtasks = responseFP.data;
    console.log(subtasks);

    try {
      await Promise.all(
        subtasks.map((subtask) => deleteSubTask(subtask.id))
      );
    } catch (error) {
      console.error("Deleting subtasks error:", error);
      return { error: "Failed to deleting subtasks" };
    }
  }
  // return responseFP.data;

  let response;
  try {
    response = await axios.delete(`http://localhost:8000/todolist/api/v1/tasks/delete_task/`, {
      params: {
        id_task: id_task
      },
      headers: {
        'Authorization': `Token ${token}`
      }
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
  return response;
}

// SubTasks
export const createSubTask = async (id_task, titleSubTask, descriptionSubTask) => {
  const data = {
    task: id_task,
    subtask_name: titleSubTask,
    description: descriptionSubTask
  };

  let response;
  try {
    response = await axios.post("http://localhost:8000/todolist/api/v1/subtasks/", data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error(`Error creating subtask '${titleSubTask}':`, error);
    throw error;
  }
}

export const fetchSubTask = async (id_task, token) => {
  // console.log(id_task);
  return axios.get(`http://localhost:8000/todolist/api/v1/subtasks/by_task/`, {
    params: {
      id_task: id_task
    },
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
}

export const deleteSubTask = async (id_subtask) => {
  let response;
  try {
    response = await axios.delete(`http://localhost:8000/todolist/api/v1/subtasks/delete_subtask/`, {
      params: {
        id_subtask: id_subtask
      }
    });
  } catch (error) {
    console.error("Error deleting subtask:", error);
    throw error;
  }
  return response;
}

export const updateSubtask = async (id_subtask, updatedData) => {
  try {
    const response = await axios.put("http://localhost:8000/todolist/api/v1/subtasks/update_subtask/", {
      id_subtask,
      ...updatedData
    });
    return response.data;
  } catch (error) {
    console.error('Error updating subtask:', error);
    throw error;
  }
};