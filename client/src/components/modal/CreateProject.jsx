import React, { useContext, useEffect, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { createProject, fetchUsers, getUserProfile } from '../../api/todolist.api';
import Modal from '../organisims/Modal';
import TitleLabel from '../atoms/TitleLabel';
import SubTitleLabel from '../atoms/SubTitleLabel';
import { AuthContext } from '../../context/AuthContext';

export function CreateProject({ addNewProject }) {
  const { userId } = useContext(AuthContext);
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
      if (searchQuery != "" && searchQuery.length >= 3) {
        const token = localStorage.getItem('token');
        try {
          // Buscar miembros cuando el usuario escribe en el campo de búsqueda 
          const response = await fetchUsers(searchQuery, token);
          setSuggestions(response.data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      } else {
        setSuggestions([]);
      }
    };
    fetchUsersAsync();
  }, [searchQuery]);

  const handlerCreateProject = async () => {
    if (!titleProject || !descripcionProject || !limitDate) {
      console.error("Title, Description, and Due date are required");
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      let memberIds = [];
      memberIds.push(userId); // Agregamos a la lista al usuario quien crea el proyecto
      memberIds = [...memberIds, ...members.map(member => member.id)];       

      const newProject = await createProject(
        titleProject, 
        descripcionProject, 
        '#fff', 
        limitDate, 
        memberIds,
        token
      );
  
      addNewProject(newProject.data);
      closeModal();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };
  

  return (
    <div>
      <button className="blue-button" onClick={openModal}> <FaPlus /> New Project</button>
      {isOpen && (
        <Modal>
          <div className="modal-content">
            <div className='general-options-modal'>
              <TitleLabel label={'Create New Project'} />
              <div className='input-label'>
                <label htmlFor="projectName">Name*</label>
                <input
                  id="projectName"
                  type="text"
                  placeholder="Project name..."
                  value={titleProject}
                  onChange={(e) => setTitleProject(e.target.value)} />
              </div>
              <div className='input-label'>
                <label htmlFor="projectDescription">Description*</label>
                <textarea
                  id="projectDescription"
                  className="description-textarea"
                  placeholder="Project description..."
                  value={descripcionProject}
                  onChange={(e) => setDescriptionProject(e.target.value)} />
              </div>
              <div className='input-label'>
                <label htmlFor="limitDate">Limit Date*</label>
                <input
                  id="limitDate"
                  type="date"
                  value={limitDate}
                  onChange={(e) => setLimitDate(e.target.value)} />
              </div>
            </div>
            <div className='miembros'>
              <label htmlFor="searchMembers">Add members</label>
              <div className='input-label'>
                <input
                  id="searchMembers"
                  type="text"
                  placeholder="Search members by email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div>
              <label htmlFor="searchMembers">Members in project</label>
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
                  {members.length > 0 ? (                    
                    members.map((member, index) => (
                      <li key={index}>
                      {member.email}
                      <span className="remove-member" onClick={() => removeMember(index)}><FaTrash /></span>
                      </li>
                    ))
                  ) : (
                      <p>No members</p>
                  )}
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="button" onClick={handlerCreateProject}>Create</button>
              <button className="button" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </Modal>

      )}
    </div>
  );
}

export default CreateProject;
