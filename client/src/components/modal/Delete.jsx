import { useState } from "react";
import { FaTrash } from 'react-icons/fa';
import Modal from "../organisims/Modal";
import TitleLabel from "../atoms/TitleLabel";

export function Delete({ name, deleteMethod, type }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}><FaTrash /> Delete {type}</button>
      {isOpen && (
        <Modal>
          <div className="modal-content">
            <TitleLabel label={`Are you sure you want to delete ${name}?`}/>
            <div className="modal-footer">
              <p className="button" onClick={() => {
                deleteMethod();
                closeModal();
              }}>Yes</p>
              <p className="button" onClick={closeModal}>No</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Delete;
