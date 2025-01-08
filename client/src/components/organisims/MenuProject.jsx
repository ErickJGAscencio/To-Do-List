import React from 'react'
import TitleLabel from '../atoms/TitleLabel'
import ProgressLabel from '../molecules/ProgressLabel'
import EditProject from '../modal/EditProject'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

function MenuProject({project, statusProject}) {
  const navigate = useNavigate();

  return (
    <div className="menu-project">
      <div className="menu-group">
        <button className={'blue-button'} onClick={()=>navigate('/home')}><FaArrowLeft /></button>
        <TitleLabel label={project.project_name} />
        <ProgressLabel status={statusProject} />
      </div>
      <EditProject project={project} updateDataProject={console.log} />
    </div>
  )
}

export default MenuProject