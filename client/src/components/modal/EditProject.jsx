import './EditProject.css'
import React, { useState, useEffect } from 'react';
import { FaPalette, FaPen } from 'react-icons/fa';
import { fetchTasksByProject, updateProject } from '../../api/todolist.api';

export function EditProject({ project, updateDataProject }) {
  const [idProject, setIdProject] = useState("");
  const [titleProject, setTitleProject] = useState("");
  const [descripcionProject, setDescriptionProject] = useState("");

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function getAllTasks() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetchTasksByProject(project.id, token);

          if (response.data && response.data.length > 0) {
            setTasks(response.data);
          }
        } catch (error) {
          console.error('Error getting task:', error);
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
      const token = localStorage.getItem("token");
      const newData = {
        project_name: titleProject,
        description: descripcionProject,
        tasks: tasks
      };

      const response = await updateProject(idProject, newData, token);

      const updatedData = {
        id: response.id,
        ...newData
      };

      updateDataProject(updatedData);
      closeModal();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <div>
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
