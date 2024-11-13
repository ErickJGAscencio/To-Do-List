// import './EditProject.css'
import React, { useState, useEffect, useRef } from 'react';
import { FaCircle, FaPalette, FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { fetchTasksByProject, updateProject } from '../../api/todolist.api';
import { ContextMenuColors } from '../ContextMenuColors';
import Modal from '../organisims/Modal';
import TitleLabel from '../atoms/TitleLabel';
import Button from '../atoms/Button';

export function EditProject({ project, updateDataProject }) {
  const [idProject, setIdProject] = useState("");
  const [titleProject, setTitleProject] = useState("");
  const [descripcionProject, setDescriptionProject] = useState("");

  const [tasks, setTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [color, setColor] = useState();
  const [limitDate, setLimitDate] = useState(""); // Estado para la fecha límite

  // Miembros
  const [members, setMembers] = useState([]);
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
    if (searchQuery) {
      // Buscar miembros cuando el usuario escribe en el campo de búsqueda
      // searchMembers(searchQuery).then(setSuggestions);
    } else {
      setSuggestions([]); // Limpiar sugerencias si el campo está vacío
    }

  }, [searchQuery]);


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
    console.log("Open modal");
    setColor(project.color);
    setIsOpen(true);
    setIdProject(project.id);
    setTitleProject(project.project_name);
    setDescriptionProject(project.description);
  };

  const pdtProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const newData = {
        project_name: titleProject,
        description: descripcionProject
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
      <button onClick={openModal}><FaPen />Edit Project</button>
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
                    {/* <span className="remove-member" onClick={() => removeMember(index)}>x</span> */}
                  </li>
                ))}
              </ul>
            </div>

            <div className="button-container">
              <Button label={'Create'} />
            </div>
            <div className="modal-footer">
              <p className="button" onClick={pdtProject}>Save</p>
              <p className="button" onClick={closeModal}>Cancel</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EditProject;
