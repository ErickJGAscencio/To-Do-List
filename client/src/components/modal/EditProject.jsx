import React, { useState, useEffect } from 'react';
import './EditProject.css'
import { FaPalette } from 'react-icons/fa';
import { FaPen } from 'react-icons/fa';

import { fetchTask, updateProject } from '../../Api/todolist.api';

export function EditProject({ project, updateProjectInList }) {
  const [idProject, setIdProject] = useState("");
  const [titleProject, setTitleProject] = useState("");
  const [descripcionProject, setDescriptionProject] = useState("");
  const [tasks, setTasks] = useState([]); // Para almacenar las tareas
  const [newTask, setNewTask] = useState(""); // Nueva tarea temporal
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function getAllTasks() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetchTask(project.id, token);

          if (res.data && res.data.length > 0) {
            setTasks(res.data);
          }
        } catch (error) {
          console.error('Error sending trade request:', error);
        }
      }
    }
    getAllTasks();
  }, [project]);

  const closeModal = () => {
    setIsOpen(false);
    setTitleProject("");
    setDescriptionProject("");
    setTasks([]);
  };

  const openModal = async () => {
    setIsOpen(true);

    setIdProject(project.id);
    setTitleProject(project.project_name);
    setDescriptionProject(project.description);
  };

  const addTask = () => {
    if (newTask) {
      setTasks([...tasks, newTask]);
      setNewTask("");
    }
  };

  const removeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const pdtProject = async () => {
    try {
      const updatedData = {
        project_name: titleProject,
        description: descripcionProject,
        tasks: tasks
      };

      await updateProject(idProject, updatedData);
      updateProjectInList(updatedData); // Actualizar la lista en HomePage
      // console.log(project);
      closeModal();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <div>
      {/* <button className="btn-edit" onClick={openModal}>< FaPen /></button> */}
      <FaPen onClick={openModal} />

      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className='left-section'>
              <input
                className='pname-input'
                type="text"
                placeholder="Project Name"
                value={titleProject}
                onChange={(e) => setTitleProject(e.target.value)}
              />
              <div className='tasks'>
                <div className='add-controller'>
                  <input
                    type="text"
                    placeholder="Task Name"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                  />
                  <button onClick={addTask}>Add</button>
                </div>
                <div className='task-container'>
                  {tasks.map((task, index) => (
                    <div key={task.id || index} className='task-item'>
                      {task.task_name || task}
                      <button onClick={() => removeTask(index)}>X</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='right-section'>
              <button className='btn-color'>
                <FaPalette />
              </button>
              <div className='description'>
                <h1>Description</h1>
                <textarea
                  placeholder="Project Description"
                  value={descripcionProject}
                  onChange={(e) => setDescriptionProject(e.target.value)}
                />
              </div>
              <div className='buttons-action'>
                <button onClick={pdtProject}>Edit</button>
                <button onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProject;
