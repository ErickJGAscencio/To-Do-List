import React, { useContext, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { createTask } from '../../api/todolist.api';
import Modal from '../organisims/Modal';
import TitleLabel from '../atoms/TitleLabel';
import ProjectContext from '../../context/ProjectContext';

export function CreateTask({ id_project, addNewTask, classStyle }) {
  const { members } = useContext(ProjectContext);
  const [isAssignment, setIsAssignment] = useState(false);
  const [memberAssignedId, setMemberAssignedId] = useState('');
  const [titleTask, setTitleTask] = useState("");
  const [descriptionTask, setDescriptionTask] = useState("");
  const [subTasks, setSubTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [limitDate, setLimitDate] = useState("");

  // console.log('asd', '\n', members);
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
      const newTask = await createTask(id_project, titleTask, descriptionTask, token, memberAssignedId);

      addNewTask(newTask.data);

      closeModal();
    } catch (error) {
      console.error('Error sending trade request:', error);
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
