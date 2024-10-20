import { useState } from "react";
import { FaTrash } from 'react-icons/fa';

export function Delete({ name, deleteMethod }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <div onClick={openModal}><FaTrash /></div>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Are you sure you want to delete {name}?</h2>
            </div>
            <div className="modal-footer">
              <p className="button" onClick={() => {
                deleteMethod();
                closeModal();
              }}>Yes</p>
              <p className="button" onClick={closeModal}>No</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Delete;
