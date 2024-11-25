import React from 'react'
import TitleLabel from '../atoms/TitleLabel'
import SubTitleLabel from '../atoms/SubTitleLabel'

function ProjectStadistics({ amountTasks, amountTasksCompleted, daysLeft }) {
  
  return (
    <div className="card-section">
      <TitleLabel label={'Project Stadistics'} />
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
        <SubTitleLabel label={amountTasks} />
      </div>
    </div>
  )
}

export default ProjectStadistics