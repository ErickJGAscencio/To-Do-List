import React, { useState, useEffect } from 'react';
// import './EditProject.css'
import { FaPalette, FaPen } from 'react-icons/fa';

import { updateSubtask } from '../../api/todolist.api';

export function EditSubTask({ subtask, setSubTaskFront }) {
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
      // console.log(res);
      setSubTaskFront(res);
      closeModal();
    } catch (error) {
      console.error('Error updating subtask:', error);
    }
  };

  return (
    <div>
      <FaPen onClick={openModal} />
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h1>Edit subtask</h1>
              {/* <p className='button'><FaPalette /></p> */}
            </div>
            <div className="modal-body">
              <div className='left-section'>
                <h1 className='title-input'>Subtask name</h1>
                <input
                  className='modal-name-input'
                  type="text"
                  placeholder="Subtask Name"
                  value={titleProject || ""}
                  onChange={(e) => setTitleProject(e.target.value)}
                />
              </div>
              <div className='right-section'>
                <div className='description'>
                  <h1 className='title-input'>Description</h1>
                  <textarea
                    placeholder="Project Description"
                    value={descripcionProject || ""}
                    onChange={(e) => setDescriptionProject(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <p className='button'onClick={pdtSubTask}>Save</p>
              <p className='button'onClick={closeModal}>Cancel</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSubTask;
