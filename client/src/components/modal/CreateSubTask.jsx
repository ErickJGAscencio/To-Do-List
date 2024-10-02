import { FaPalette, FaPlus } from 'react-icons/fa';
import { createSubTask } from '../../Api/todolist.api';
import { useState } from 'react';

export function CreateSubTask({ task, addNewSubTask}) {
  const [subtask_name, setsubtask_name] = useState("");
  const [descripcionSubTask, setDescriptionSubTask] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setsubtask_name("");
    setDescriptionSubTask("");
  };
  
  const sendRequest = async () => {
    if (!subtask_name) {
      alert("Subtask name is required.");
      return;
    }
    const id_task = task.id;
    try {
      const newSubTask = await createSubTask(id_task, subtask_name, descripcionSubTask);
      addNewSubTask(newSubTask);//Mandamos la nueva subtarea para agregarla a la lista y mostrarla

      closeModal();
    } catch (error) {
      console.error('Error sending subtask request:', error);
    }
  };

  return (
    <div>
      {/* <button onClick={openModal}><FaPlus /></button> */}
      <FaPlus onClick={openModal}/>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className='left-section'>
              {/* <p>{task.task_name}</p> */}
              <p>ADD NEW SUBTASK</p>
              <div className='tasks'>
                <div className='add-controller'>
                  <input
                    type="text"
                    placeholder="Task Name"
                    value={subtask_name}
                    onChange={(e) => setsubtask_name(e.target.value)}
                  />
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
                  placeholder="Project Description"
                   value={descripcionSubTask}
                   onChange={(e) => setDescriptionSubTask(e.target.value)}
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