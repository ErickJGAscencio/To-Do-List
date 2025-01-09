import React from 'react';
import TitleLabel from '../atoms/TitleLabel';
import Label from '../atoms/Label';

function ProjectMembers({ members }) {
  return (
    <div>
      <div className="card-section">
        <Label text='Team Members' type='paragraph'/>
        <div className="members">
          {members.map((member, index) => (
            <div className="member" key={index}>
              {member.username.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectMembers;
