import { FaPalette, FaPlus } from 'react-icons/fa';
import { createSubTask } from '../../api/todolist.api';
import { useState } from 'react';

export function CreateSubTask({ task, addNewSubTask }) {
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
      const token = localStorage.getItem("token");
      const newSubTask = await createSubTask(id_task, subtask_name, descripcionSubTask, token);
      addNewSubTask(newSubTask);//Mandamos la nueva subtarea para agregarla a la lista y mostrarla

      closeModal();
    } catch (error) {
      console.error('Error sending subtask request:', error);
    }
  };

  return (
    <div>
      <FaPlus onClick={openModal} />
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h1>Create new subtask</h1>
              {/* <p className='button'><FaPalette /></p> */}
            </div>
            <div className="modal-body">
              <div className='left-section'>
                <h3 className='title-input'>Subtask name</h3>
                <div className='tasks'>
                  <div className='add-controller'>
                    {/* <p className="button" onClick={addNewSubTask}>Add</p> */}
                    <input
                      className='modal-name-input'
                      type="text"
                      placeholder="e.g Do something"
                      value={subtask_name}
                      onChange={(e) => setsubtask_name(e.target.value)}
                    />
                  </div>
                  {/* <h3 className="label-input">Subtask List</h3> */}
                </div>
              </div>
              <div className='right-section'>
                <div className='description'>
                  <h3 className='title-input'>Description</h3>
                  <textarea
                    placeholder="Project Description"
                    value={descripcionSubTask}
                    onChange={(e) => setDescriptionSubTask(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <p className='button' onClick={sendRequest}>Create</p>
              <p className='button' onClick={closeModal}>Cancel</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}