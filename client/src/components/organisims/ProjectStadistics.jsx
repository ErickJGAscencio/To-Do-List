import React, { useContext } from 'react'
import SubTitleLabel from '../atoms/SubTitleLabel'
import Label from '../atoms/Label'
import ProjectContext from '../../context/ProjectContext'

function ProjectStadistics({ amountTasks, amountTasksCompleted, daysLeft }) {
  const { members } = useContext(ProjectContext);

  return (
    <div className="card-section">
      <Label text='Project Stadistics' type='paragraph' />

      <div className="stadistic-item">
        <SubTitleLabel label={'Total tasks:'} />
        <SubTitleLabel label={amountTasks} />
      </div>
      <div className="stadistic-item">
        <SubTitleLabel label={'Tasks completed:'} />
        <SubTitleLabel label={amountTasksCompleted} />
      </div>
      <div className="stadistic-item">
        <SubTitleLabel label={'Days remaining:'} />
        <SubTitleLabel label={daysLeft} />
      </div>
      <div className="stadistic-item">
        <SubTitleLabel label={'Team members:'} />
        <SubTitleLabel label={members.length} />
      </div>
    </div>
  )
}

export default ProjectStadistics