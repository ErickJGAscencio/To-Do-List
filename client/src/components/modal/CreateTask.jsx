import React, { useState } from 'react';
// import './CreateProject.css';
import { FaPalette, FaPlus } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { createTask } from '../../api/todolist.api';

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
      <p className="create-btn" onClick={openModal}><FaPlus /> New Task</p>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create new task</h2>
              <p className='button'><FaPalette /></p>
            </div>
            <div className="modal-body">
              <div className='left-section'>
                <h1 className='title-input'>Task name</h1>
                <input
                  className='modal-name-input'
                  type="text"
                  placeholder="e.g Do something"
                  value={titleTask}
                  onChange={(e) => setTitleTask(e.target.value)}
                />
                <div className='modal-tasks'>
                  <h3 className='label-input'>
                    {titleTask}
                    {titleTask != "" && (
                      "'s "
                    )}
                    Subtasks
                  </h3>
                  <div className='add-controller'>
                    <p className='button' onClick={addSubTask}>Add</p>
                    <input
                      className='modal-name-input'
                      type="text"
                      placeholder="SubTask Name"
                      value={newSubTask}
                      onChange={(e) => setNewSubTask(e.target.value)}
                    />
                  </div>
                  <h3 className='label-input'>Subtask list</h3>
                  <div className='task-container'>
                    {subTasks.map((subtask, index) => (
                      <div key={index} className='task-item'>
                        {subtask}
                        <p className='button' onClick={() => removeSubTask(index)}>
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
                    placeholder="Task Description"
                    value={descriptionTask}
                    onChange={(e) => setDescriptionTask(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
                <p className='button' onClick={sendRequest}>Create</p>
                <p className='button' onClick={closeModal}>Cancel</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateTask;
