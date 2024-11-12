import React, { useEffect, useRef, useState } from 'react';
import { FaPalette, FaPlus } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { createProject, getUserProfile } from '../../api/todolist.api';
import { ContextMenuColors } from '../ContextMenuColors';
import Modal from '../organisims/Modal';
import TitleLabel from '../atoms/TitleLabel';
import Button from '../atoms/Button';

export function CreateProject({ addNewProject }) {
  const [titleProject, setTitleProject] = useState("");
  const [descripcionProject, setDescriptionProject] = useState("");
  const [tasks, setTasks] = useState([]);
  const [limitDate, setLimitDate] = useState(""); // Estado para la fecha límite
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState();

 // Miembros
 const [members, setMembers] = useState([]);
 const [searchQuery, setSearchQuery] = useState("");
 const [suggestions, setSuggestions] = useState([]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTitleProject("");
    setDescriptionProject("");
    setTasks([]);
    setMembers([]);
    setLimitDate("");
  };

  const addMember = (member) => {
    setMembers([...members, member]);
    setSearchQuery("");
    setSuggestions([]);
  };

  const removeMember = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  useEffect(() => {
    if (searchQuery) {
      // Buscar miembros cuando el usuario escribe en el campo de búsqueda
      // searchMembers(searchQuery).then(setSuggestions);
    } else {
      setSuggestions([]); // Limpiar sugerencias si el campo está vacío
    }
    
  }, [searchQuery]);

  const sendRequest = async () => {
    if (!titleProject || !descripcionProject) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const newProject = await createProject(titleProject, descripcionProject, color, tasks, token);

      addNewProject(newProject.data);

      closeModal();
    } catch (error) {
      console.error('Error sending trade request:', error);
    }
  };

  return (
    <div>
      <button className="create-btn" onClick={openModal}> <FaPlus /> New Project</button>
      {isOpen && (
        <Modal>
          <div className="modal-content">
            <TitleLabel label={'Create New Project'} />
            <div className='input-label'>
              <p>Name</p>
              <input
                type="text"
                placeholder="Project name..." 
                value={titleProject}
                onChange={(e) => setTitleProject(e.target.value)}/>
            </div>

            <div className='input-label'>
              <p>Description</p>
              <textarea
                className="description-textarea" // Clase CSS añadida
                placeholder="Project description..."
                value={descripcionProject}
                onChange={(e) => setDescriptionProject(e.target.value)} />
            </div>

            <div className='input-label'>
              <p>Limit Date</p>
              <input
                type="date"
                value={limitDate}
                onChange={(e) => setLimitDate(e.target.value)} />
            </div>
            
            <div className='input-label'>
              <p>Members</p>
              <input
                type="text"
                placeholder="Search members by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} />

              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => addMember(suggestion)}>
                      {suggestion.email}
                    </li>
                  ))}
                </ul>
              )}

              <ul className="members-list">
                {members.map((member, index) => (
                  <li key={index}>
                    {member.email}
                    <span className="remove-member" onClick={() => removeMember(index)}>x</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="button-container">
              <Button label={'Create'} />
            </div>
              <div className="modal-footer">
                <p className="button" onClick={sendRequest}>Create</p>
                <p className="button" onClick={closeModal}>Cancel</p>
              </div>
          </div>
        </Modal>        
      )}
    </div>
  );
}

export default CreateProject;
