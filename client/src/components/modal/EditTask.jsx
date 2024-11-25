import React, { useState, useEffect, useRef } from 'react';
// import './EditProject.css'
import { FaTrash } from 'react-icons/fa';
import { FaPen } from 'react-icons/fa';

import { updateTask } from '../../api/todolist.api';
import { ContextMenuColors } from '../ContextMenuColors';
import Modal from '../organisims/Modal';
import TitleLabel from '../atoms/TitleLabel';

export function EditTask({ task, updateTaskData }) {
  const [idTask, setIdTask] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [limitDate, setLimitDate] = useState("")
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
      <button className={'black-button'} onClick={openModal}><FaPen /></button>
      {isOpen && (
        <Modal>
          <div className="modal-content">
            <TitleLabel label={'Edit Task'} />
            <div className="input-label">
              <p>Name</p>
              <input
                type="text"
                placeholder="e.g Do something"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>
            <div className="input-label">
              <p className='title-input'>Description</p>
              <textarea
                className="description-textarea"
                placeholder="Task Description"
                value={taskDescription || ""}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
            </div>
            
            <div className='input-label'>
              <p>Limit Date</p>
              <input
                type="date"
                value={limitDate}
                onChange={(e) => setLimitDate(e.target.value)} />
            </div>

            <div className="modal-footer">
              <p className='button' onClick={pdtTask}>Save</p>{/*CAMBIAR <p> POR <p> PARA QUE NO HAYA CONFLICTO DE BOTONES ANIDADOS*/}
              <p className='button' onClick={closeModal}>Cancel</p>{/*CAMBIAR <button> POR <p> PARA QUE NO HAYA CONFLICTO DE BOTONES ANIDADOS*/}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EditTask;
