import React from 'react'
import TitleLabel from '../atoms/TitleLabel'
import { FaPlus } from 'react-icons/fa'

function ProjectMembers({userId, members}) {
  return (
    <div>
      <div className="card-section">
        <TitleLabel label={'Team Members'} />
        <div className="members">
          <div className="member" >
            {userId}
          </div>
          {members.map((member, index) => (
            <div className="member" key={index}>
              {member.id}
            </div>
          ))}
          <div className="member">
            <FaPlus />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectMembers