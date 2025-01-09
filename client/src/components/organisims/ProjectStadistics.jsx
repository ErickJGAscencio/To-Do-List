import React from 'react'
import SubTitleLabel from '../atoms/SubTitleLabel'
import Label from '../atoms/Label'

function ProjectStadistics({ amountTasks, amountTasksCompleted, daysLeft }) {

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
        <SubTitleLabel label={amountTasks} />
      </div>
    </div>
  )
}

export default ProjectStadistics