import './ProjectCard.css';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { deleteProject } from '../api/todolist.api';
import { EditProject } from './modal/EditProject';
import { useEffect, useState } from 'react';

export function ProjectCard({ project, updateProjectInList }) {
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(project);
  }, [project]);

  const dltProject = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await deleteProject(project.id, token);
        // Aquí puedes agregar lógica para eliminar el proyecto de la lista en HomePage
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
          <EditProject project={project} updateProjectInList={updateProjectInList} />
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