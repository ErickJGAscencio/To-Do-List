import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { createTask } from '../../api/todolist.api';
import Modal from '../organisims/Modal';
import TitleLabel from '../atoms/TitleLabel';
import Button from '../atoms/Button';

export function CreateTask({ id_project, addNewTask, classStyle }) {
  const [titleTask, setTitleTask] = useState("");
  const [descriptionTask, setDescriptionTask] = useState("");
  const [subTasks, setSubTasks] = useState([]);
  const [newSubTask, setNewSubTask] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [limitDate, setLimitDate] = useState("");

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTitleTask("");
    setDescriptionTask("");
    setSubTasks([]);
    setLimitDate("");
  };

  const sendRequest = async () => {
    if (!titleTask) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const newTask = await createTask(id_project, titleTask, descriptionTask, subTasks, token);

      addNewTask(newTask.data);

      closeModal();
    } catch (error) {
      console.error('Error sending trade request:', error);
    }
  };



  return (
    <div>
      <button className={ classStyle } onClick={openModal}><FaPlus /> New Task</button>
      {isOpen && (
        <Modal>
          <div className="modal-content">
            <TitleLabel label={'Create New Task'} />
            <div className='input-label'>
              <p>Name</p>
              <input
                type="text"
                placeholder="Project name..."
                value={titleTask}
                onChange={(e) => setTitleTask(e.target.value)} />
            </div>
            <div className='input-label'>
              <p>Description</p>
              <textarea
                className="description-textarea" 
                placeholder="Project description..."
                value={descriptionTask}
                onChange={(e) => setDescriptionTask(e.target.value)} />
            </div>
            <div className='input-label'>
              <p>Limit Date</p>
              <input
                type="date"
                value={limitDate}
                onChange={(e) => setLimitDate(e.target.value)} />
            </div>
            <div className="modal-footer">
              <p className="button" onClick={sendRequest}>Save</p>
              <p className="button" onClick={closeModal}>Cancel</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default CreateTask;
