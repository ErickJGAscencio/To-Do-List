import React, { useState, useEffect } from 'react';
import './EditProject.css'
import { FaPalette, FaPen } from 'react-icons/fa';

import { updateSubtask } from '../../api/todolist.api';

export function EditSubTask({ subtask }) {
  const [idSubTask, setIdProject] = useState("");
  const [titleProject, setTitleProject] = useState("");
  const [descripcionProject, setDescriptionProject] = useState("");
  const [isOpen, setIsOpen] = useState(false);


  const closeModal = () => {
    setIsOpen(false);
    setTitleProject("");
    setDescriptionProject("");
  };

  const openModal = async () => {
    setIsOpen(true);
    setIdProject(subtask.id);
    setTitleProject(subtask.subtask_name);
    setDescriptionProject(subtask.description);
  };

  const pdtSubTask = async () => {
    try {
      const updatedData = {
        subtask_name: titleProject,
        description: descripcionProject
      };
      const token = localStorage.getItem("token");
      const res = await updateSubtask(idSubTask, updatedData, token);
      ///AHORA QUEDA ACTUALIZAR EL DOM PARA MOSTRAR LOS DATOS ACTUALIZADOS
      closeModal();
    } catch (error) {
      console.error('Error updating subtask:', error);
    }
  };

  return (
    <div>
      <div className="action-btn">
        <FaPen onClick={openModal} />
      </div>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className='left-section'>
              <input
                className='pname-input'
                type="text"
                placeholder="Subtask Name"
                value={titleProject || ""}
                onChange={(e) => setTitleProject(e.target.value)}
              />
            </div>
            <div className='right-section'>
              <button className='btn-color'>
                <FaPalette />
              </button>
              <div className='description'>
                <h1>Description</h1>
                <textarea
                  placeholder="Project Description"
                  value={descripcionProject || ""}
                  onChange={(e) => setDescriptionProject(e.target.value)}
                />
              </div>
              <div className='buttons-action'>
                <button onClick={pdtSubTask}>Edit</button>
                <button onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSubTask;
