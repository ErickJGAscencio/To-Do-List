import React, { useState, useEffect, useRef } from 'react';
// import './EditProject.css'
import { FaTrash } from 'react-icons/fa';
import { FaPen } from 'react-icons/fa';

import { updateTask } from '../../api/todolist.api';
import { ContextMenuColors } from '../ContextMenuColors';

export function EditTask({ task, updateTaskData }) {
  const [idTask, setIdTask] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [color, setColor] = useState();

  const menuRef = useRef(null);

  const closeModal = () => {
    setIsOpen(false);
    setTaskName("");
    setTaskDescription("");
  };

  const openModal = async () => {
    setIsOpen(true);

    setColor(task.color);
    setIdTask(task.id);
    setTaskName(task.task_name);
    setTaskDescription(task.description);
  };

  const pdtTask = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const updatedData = {
          task_name: taskName,
          description: taskDescription,
          color: color,
        };
        await updateTask(task.id, updatedData, token);
        updateTaskData({ ...task, ...updatedData });

        closeModal();
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };  

  const setSelectedColor = (color) => {
    setColor(color);
  }

  return (
    <div>
      <FaPen onClick={openModal} />
      {isOpen && (
        <div className="modal">
          <div className="modal-content"
            style={{
              backgroundImage: `linear-gradient(to bottom, #2D2D2D, ${color})`
            }}
          >
            <div className="modal-header">
              <h1>Edit task</h1>
              
              <ContextMenuColors menuRef={menuRef} setSelectedColor={setSelectedColor} />
                
            </div>
            <div className="modal-body">
              <div className='left-section'>
                <h3 className='title-input'>Task name</h3>
                <input
                  className='modal-name-input'
                  type="text"
                  placeholder="e.g Do something"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
                
              </div>
              <div className='right-section'>
                <div className='description'>
                  <h1 className='title-input'>Description</h1>
                  <textarea
                    placeholder="Task Description"
                    value={taskDescription || ""}
                    onChange={(e) => setTaskDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <p className='button' onClick={pdtTask}>Save</p>{/*CAMBIAR <p> POR <p> PARA QUE NO HAYA CONFLICTO DE BOTONES ANIDADOS*/}
              <p className='button' onClick={closeModal}>Cancel</p>{/*CAMBIAR <button> POR <p> PARA QUE NO HAYA CONFLICTO DE BOTONES ANIDADOS*/}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTask;
