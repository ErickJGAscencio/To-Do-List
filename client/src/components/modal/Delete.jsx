import { useState } from "react";
import { FaTrash } from 'react-icons/fa';

export function Delete() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };
  return (
    <div>
      <button onClick={openModal}><FaTrash /></button>

      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            
          </div>
        </div>
      )}
    </div>
  );
}

export default Delete;
