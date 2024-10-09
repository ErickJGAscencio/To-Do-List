import React, { useState } from 'react';
import './CreateProject.css';
import { FaPalette, FaPlus } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { createTask } from '../../Api/todolist.api';

export function CreateTask({ id_project, addNewTask }) {
  const [titleTask, setTitleTask] = useState("");
  const [descriptionTask, setDescriptionTask] = useState("");
  const [subTasks, setSubTasks] = useState([]); 
  const [newSubTask, setNewSubTask] = useState("");
  const [isOpen, setIsOpen] = useState(false);


  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTitleTask("");
    setDescriptionTask("");
    setSubTasks([]);
  };

  const addSubTask = () => {
    if (newSubTask) {
      setSubTasks([...subTasks, newSubTask]);
      setNewSubTask("");
    }
  };

  const removeSubTask = (index) => {
    const updatedTasks = subTasks.filter((_, i) => i !== index);
    setSubTasks(updatedTasks);
  };

  const sendRequest = async () => {
    if (!titleTask) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const newTask = await createTask(id_project, titleTask, subTasks, token);
      
      addNewTask(newTask.data);

      closeModal();
    } catch (error) {
      console.error('Error sending trade request:', error);
    }
  };



  return (
    <div>
      {/* <button onClick={openModal}>New Task</button> */}
      <p className="create-btn" onClick={openModal}><FaPlus /> New Task</p>

      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className='left-section'>
              <input
                className='pname-input'
                type="text"
                placeholder="Task Name"
                value={titleTask}
                onChange={(e) => setTitleTask(e.target.value)}
              />
              <div className='tasks'>
                <div className='add-controller'>
                  <input
                    type="text"
                    placeholder="SubTask Name"
                    value={newSubTask}
                    onChange={(e) => setNewSubTask(e.target.value)}
                  />
                  <button onClick={addSubTask}>Add</button>
                </div>
                <div className='task-container'>
                  {subTasks.map((subtask, index) => (
                    <div key={index} className='task-item'>
                      {subtask}
                      <button onClick={() => removeSubTask(index)}>
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
                  placeholder="Task Description"
                  value={descriptionTask}
                  onChange={(e) => setDescriptionTask(e.target.value)}
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

export default CreateTask;
