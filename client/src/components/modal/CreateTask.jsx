import React, { useContext, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { createTask } from '../../services/todolist.api';
import Modal from '../organisims/Modal';
import TitleLabel from '../atoms/TitleLabel';
import ProjectContext from '../../context/ProjectContext';

export function CreateTask({ id_project, addNewTask, classStyle }) {
  const { members } = useContext(ProjectContext);
  const [isAssignment, setIsAssignment] = useState(false);
  const [memberAssignedId, setMemberAssignedId] = useState('');
  const [titleTask, setTitleTask] = useState("");
  const [descriptionTask, setDescriptionTask] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [limitDate, setLimitDate] = useState("");

  const openModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setTitleTask("");
    setDescriptionTask("");
    // setSubTasks([]);
    setLimitDate("");
  };

const handleCreateTask = async () => {
  if (!titleTask?.trim()) {
    console.warn("Task title is required.");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. User might not be authenticated.");
    return;
  }

  try {
    const payload = {
      id_project,
      title: titleTask.trim(),
      description: descriptionTask?.trim() || "",
      // assigned_to: memberAssignedId || null,
    };

    // Crear tarea
    const response = await createTask(
      token,
      payload.id_project,
      payload.title,
      payload.description,
      // payload.assigned_to
    );

    if (response?.data) {
      addNewTask(response.data);
      handleCloseModal();
    } else {
      console.error("Unexpected response format:", response);
    }
  } catch (err) {
    console.error("Error creating task:", err.message || err);
  }
};

  const handlerMemberToAssign = (memberId) => {
    console.log('asignado a: ', memberId)
    setMemberAssignedId(memberId);
  }

  return (
    <div>
      <button className={classStyle} onClick={openModal}><FaPlus /> New Task</button>
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
                placeholder="project description..."
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
            <div>
              <input type="checkbox" value={isAssignment} onChange={(e)=>setIsAssignment(e.target.checked)}/>
              {isAssignment ? (
                <div className='input-label'>
                  <p>Assign to</p>
                  <input type="text" name="" placeholder="search member to asign" id="" />
                  <div>
                    {members.map((item, index) => (
                      <button onClick={() => handlerMemberToAssign(item.id)} key={index}>{item.username}</button>
                    ))}
                  </div>
                </div>
              ) : (
                  null
              )}
            </div>
            <div className="modal-footer">
              <p className="button" onClick={handleCreateTask}>Save</p>
              <p className="button" onClick={handleCloseModal}>Cancel</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default CreateTask;
