import React from 'react'
import TitleLabel from '../atoms/TitleLabel'
import SubTitleLabel from '../atoms/SubTitleLabel'

function InformationProject({ project, projectProgress }) {
  return (
    <div className="information-project">
      <div className="card-section">
        <TitleLabel label={'Project Description'} />
        <SubTitleLabel label={project.description} />
      </div>

      <div className="card-section">
        <TitleLabel label={"Overall Progress"} />
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