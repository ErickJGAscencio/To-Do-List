import React from 'react'
import SubTitleLabel from '../atoms/SubTitleLabel'
import Label from '../atoms/Label'

function InformationProject({ project, projectProgress }) {
  return (
    <div className="information-project">
      <div className="card-section">
        <Label text="Project Description" type="paragraph" />
        <Label text={project.description}  type="default" />
      </div>

      <div className="card-section">
        <Label text="Overall Progress" type="paragraph" />
        <div className="progress-section">
          <div className="progress-bar">
            <div className="progress-bar-fill"
              style={{ width: `${projectProgress}%` }}
            ></div>
          </div>
        </div>
        <SubTitleLabel label={`${projectProgress}% completed`} />
      </div>

    </div>
  )
}

export default InformationProject