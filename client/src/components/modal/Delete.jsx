import "./Delete.css";
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
      <button onClick={openModal}><FaTrash /></button>

      {isOpen && (
        <div className="modal">
          <div className="modalDle-content">
            <h2>Are you sure you want to DELETE {name}?</h2>
            <div className="modal-buttons">
              <button onClick={() => {
                deleteMethod();
                closeModal();
              }}>Yes</button>
              <button onClick={closeModal}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Delete;
