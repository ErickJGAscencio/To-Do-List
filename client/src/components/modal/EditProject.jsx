// import './EditProject.css'
import React, { useState, useEffect } from 'react';
import { FaPen } from 'react-icons/fa';
import { fetchTasksByProject, fetchUsers, updateProject } from '../../api/todolist.api';
import Modal from '../organisims/Modal';
import TitleLabel from '../atoms/TitleLabel';

export function EditProject({ project, updateDataProject }) {
  const [idProject, setIdProject] = useState("");
  const [titleProject, setTitleProject] = useState("");
  const [descripcionProject, setDescriptionProject] = useState("");

  const [tasks, setTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [limitDate, setLimitDate] = useState("");

  // Miembros
  const [members, setMembers] = useState(project.team_members);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);


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
    async function getAllTasks() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetchTasksByProject(project.id, token);

          if (response.data && response.data.length > 0) {
            setTasks(response.data);
          }
        } catch (error) {
          console.error('Error getting task:', error);
        }
      }
    }
    getAllTasks();
  }, [project]);

  const closeModal = () => {
    setIsOpen(false);
    setTitleProject("");
    setDescriptionProject("");
    setMembers([]);
    setLimitDate("");
  };

  const openModal = async () => {
    setIsOpen(true);
    setIdProject(project.id);
    setTitleProject(project.project_name);
    setDescriptionProject(project.description);
    setLimitDate(project.due_date);
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

  const handleUpdateProject = async () => {
    try {
      const token = localStorage.getItem("token");
      let memberIds = [];
      memberIds = [...memberIds, ...members.map(member => member.id)];     
      
      const newData = {
        project_name: titleProject,
        description: descripcionProject,
        team_members: memberIds
      };

      const response = await updateProject(idProject, newData, token);

      const updatedData = {
        id: response.id,
        ...newData
      };

      updateDataProject(updatedData);
      closeModal();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <div>
      <button className={'blue-button'} onClick={openModal}><FaPen /> Edit Project</button>
      {isOpen && (
        <Modal>
          <div className="modal-content">
            <TitleLabel label={'Edit Project'} />
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
                className="description-textarea"
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
            <label htmlFor="searchMembers">Add members</label>
            <div className='input-label'>
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
              <label htmlFor="searchMembers">Members in project</label>
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
              <p className="button" onClick={handleUpdateProject}>Save</p>
              <p className="button" onClick={closeModal}>Cancel</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EditProject;
