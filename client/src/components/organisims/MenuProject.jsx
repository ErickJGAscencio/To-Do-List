import React, { useEffect, useState } from 'react'
import TitleLabel from '../atoms/TitleLabel'
import ProgressLabel from '../molecules/ProgressLabel'
import EditProject from '../modal/EditProject'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

function MenuProject({ project: initialProject, statusProject }) {
  const navigate = useNavigate();
  const [project, setProject] = useState(initialProject);

  useEffect(() => {
    setProject(initialProject);
  }, [initialProject]);

  const updateDataProject = (updatedProject) => {
    console.log(updatedProject);
    setProject(updatedProject);
  };

  return (
    <div className="menu-project">
      <div className="menu-group">
        <button className={'blue-button'} onClick={() => navigate('/home')}><FaArrowLeft /></button>
        <TitleLabel label={project.project_name} />
        <ProgressLabel status={statusProject} />
      </div>
      <EditProject project={project} updateDataProject={updateDataProject} />
    </div>
  )
}

export default MenuProject
