import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { createProject, fetchUsers, getUserProfile } from '../../api/todolist.api';
import Modal from '../organisims/Modal';
import TitleLabel from '../atoms/TitleLabel';

export function CreateProject({ addNewProject }) {
  const [titleProject, setTitleProject] = useState("");
  const [descripcionProject, setDescriptionProject] = useState("");
  const [limitDate, setLimitDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
    setMembers([]);
    setLimitDate("");
    setSuggestions([]);
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
    const fetchUsersAsync = async () => {
      if (searchQuery != "") {
        try {
          // Buscar miembros cuando el usuario escribe en el campo de búsqueda 
          const response = await fetchUsers(searchQuery);
          console.log('Front');
          console.log(response.data);
          setSuggestions(response.data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      } else {
        setSuggestions([]);
      }
    }   
  fetchUsersAsync();
}, [searchQuery]); 

  const sendRequest = async () => {
    if (!titleProject || !descripcionProject) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // console.log(members);
      const newProject = await createProject(titleProject, descripcionProject, '#fff', limitDate, token);

      addNewProject(newProject.data);

      closeModal();
    } catch (error) {
      console.error('Error sending trade request:', error);
    }
  };

  return (
    <div>
      <button className="blue-button" onClick={openModal}> <FaPlus /> New Project</button>
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
                onChange={(e) => setTitleProject(e.target.value)} />
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
            </div>

            <div>
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
