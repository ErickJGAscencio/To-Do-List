import './ProjectCard.css';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { EditProject } from './modal/EditProject';
import { useEffect, useState } from 'react';
import { deleteProject } from '../api/todolist.api';

export function ProjectCard({ project, updateDataProject, removeProject }) {
  const navigate = useNavigate();

  const dltProject = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        removeProject(project.id);
        const response = await deleteProject(project.id, token);        
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div>
      <div className="card">
        <h4>{project.project_name}</h4>
        <div className='action-btn'>
          <FaTrash onClick={dltProject} />
          <EditProject project={project} updateDataProject={updateDataProject} />
        </div>
        <div className="click-zone"
          onClick={() => {
            navigate(`/project/${project.id}`)
          }}>
          <div className="content-section">
            <p>{project.description}</p>
          </div>

          <div className="progress-section">
            <div className="progress-bar">
              <div className="progress-bar-fill"></div>
            </div>
            <div>100%</div>
          </div>
        </div>
      </div>
    </div>
  )
}