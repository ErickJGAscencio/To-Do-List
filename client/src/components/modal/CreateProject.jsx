import React, { useRef, useState } from 'react';
import { FaPalette, FaPlus } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { createProject, getUserProfile } from '../../api/todolist.api';
import { ContextMenuColors } from '../ContextMenuColors';

export function CreateProject({ addNewProject }) {
  const [titleProject, setTitleProject] = useState("");
  const [descripcionProject, setDescriptionProject] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef(null);
  const [color, setColor] = useState();

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

      const newProject = await createProject(titleProject, descripcionProject, color, tasks, token);

      addNewProject(newProject.data);

      closeModal();
    } catch (error) {
      console.error('Error sending trade request:', error);
    }
  };

  const setSelectedColor = (color) => {
    setColor(color);
  }

  return (
    <div>
      <button className="create-btn" onClick={openModal}> <FaPlus /> New Project</button>
      {isOpen && (
        <div className="modal">
          <div className="modal-content"
            style={{
              backgroundImage: `linear-gradient(to bottom, #2D2D2D, ${color})`
            }}
          >
            <div className="modal-header">
              <h2>Create New Project</h2>
              <ContextMenuColors menuRef={menuRef} setSelectedColor={setSelectedColor} />
            </div>
            <div className="modal-body">
              <div className='left-section'>
                <h3 className='title-input'>Project name</h3>
                <input
                  className='modal-name-input'
                  type="text"
                  placeholder="eg. BioApp"
                  value={titleProject}
                  onChange={(e) => setTitleProject(e.target.value)}
                />
                <div className='modal-tasks'>
                <h3 className='label-input'>
                    {titleProject}
                    {titleProject != "" && (
                      "'s "
                    )}
                    Tasks
                  </h3>
                  <div className='add-controller'>
                    <p className="button" onClick={addTask}>Add</p>
                    <input
                      className='modal-name-input'
                      type="text"
                      placeholder="Task Name"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                    />
                  </div>
                  <h3 className="label-input">Task List</h3>
                  <div className='task-container'>
                    {tasks.map((task, index) => (
                      <div key={index} className='task-item'>
                        {task}
                        <p className="button" onClick={() => removeTask(index)}>
                          <FaTrash
                            size={10} />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className='right-section'>
                <div className='description'>
                  <h1 className='title-input'>Description</h1>
                  <textarea
                    placeholder="Project Description"
                    value={descripcionProject}
                    onChange={(e) => setDescriptionProject(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <p className="button" onClick={sendRequest}>Create</p>
              <p className="button" onClick={closeModal}>Cancel</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateProject;
