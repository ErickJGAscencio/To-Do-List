import React, { useState } from 'react';
import './CreateProject.css';
import { FaPalette, FaPlus } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { createProject } from '../../Api/todolist.api';
import { getUserProfile } from '../../Api/todolist.api';

export function CreateProject({ addNewProject }) {
  const [titleProject, setTitleProject] = useState("");
  const [descripcionProject, setDescriptionProject] = useState("");
  const [tasks, setTasks] = useState([]); 
  const [newTask, setNewTask] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTitleProject("");
    setDescriptionProject("");
    setTasks([]); // Limpiar tareas
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

  const sendRequest = async () => {
    if (!titleProject || !descripcionProject) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const resUser = await getUserProfile(token);
      const id = resUser.data.id;
      
      const newProject = await createProject(id, titleProject, descripcionProject, tasks);

      addNewProject(newProject.data);

      closeModal();
    } catch (error) {
      console.error('Error sending trade request:', error);
    }
  };

  return (
    <div>
      <p className="create-btn" onClick={openModal}> <FaPlus /> New project</p>
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
                    <div key={index} className='task-item'>
                      {task}
                      <button onClick={() => removeTask(index)}>
                        <FaTrash
                          size={10} />
                      </button>
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
                <button onClick={sendRequest}>Create</button>
                <button onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateProject;
