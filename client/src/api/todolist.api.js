import axios from 'axios';

// Autenticación
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

//Projects
export const createProject = async (userId, projectName, projectDescription, tasks) => {
  const data = {
    project_name: projectName,
    description: projectDescription,
    user: userId
  };

  let response;
  try {
    response = await axios.post("http://localhost:8000/todolist/api/v1/projects/", data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error("Creating project error:", error);
    return { error: "Failed to create project" };
  }

  if (!response || !response.data || !response.data.id) {
    console.error("Invalid project creation response:", response);
    return { error: "Invalid project creation response" };
  }

  const id_project = response.data.id;

  if (!tasks || tasks.length === 0) {
    return response;
  }

  try {
    // Usamos Promise.all() para enviar todas las peticiones de creación de tareas al mismo tiempo.
    await Promise.all(//CAMBIAR A UN FOR PORQUE ESTÁ RARO COMO SE VAN GUARDADON EJ(1,2,3) O (2,1,3) EN ESE ORDEN
      tasks.map((task) => createTask(id_project, task))
    );
  } catch (error) {
    console.error("Creating tasks error:", error);
    return { error: "Failed to create tasks" };
  }

  return response;
};

export const fetchAllProjects = (userId, token) => {
  return axios.get(`http://localhost:8000/todolist/api/v1/projects/by_user/`, {
    params: {
      user_id: userId
    },
    headers: {
      'Authorization': `Token ${token}`
    }
  });
};

export const fetchInProcessProjects = () => {
  return axios.get('');
};

export const fetchCompletedProjects = () => {
  return axios.get('');
};

export const updateProject = async (id_project, updatedData) => {
  try {
    const response = await axios.put("http://localhost:8000/todolist/api/v1/projects/update_project/", {
      id_project,  // Pasamos el ID del proyecto
      ...updatedData  // Pasamos los datos actualizados
    });
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (idProject, token) => {

  let responseFP = await fetchTask(idProject, token);

  if (responseFP.data.length > 0) {
    console.log("Si tiene tareas");
    const task = responseFP.data;
    console.log(task);

    try {
      await Promise.all(
        task.map((subtask) => deleteTask(subtask.id, token))
      );
    } catch (error) {
      console.error("Deleting task error:", error);
      return { error: "Failed to deleting task" };
    }
  }
  // return responseFP.data;

  let response;
  try {
    response = axios.delete(`http://localhost:8000/todolist/api/v1/projects/delete_project/`, {
      params: {
        id_project: idProject
      }
    });
  } catch (error) {
    console.error("Error deleting projects:", error);
    throw error;
  }
  return response;

  // console.log("Borrar project");
}

//Tasks
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

export const fetchTask = async (id_project, token) => {
  return await axios.get(`http://localhost:8000/todolist/api/v1/tasks/by_project/`, {
    params: {
      id_project: id_project
    },
    headers: {
      'Authorization': `Token ${token}`
    }
  });
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
export const updateTask = async (id_task, updatedData) => {
  try {
    const response = await axios.put("http://localhost:8000/todolist/api/v1/tasks/update_task/", {
      id_task,
      ...updatedData
    });
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

//SubTasks
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