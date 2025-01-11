import React, { createContext, useState } from 'react';

export const ProjectContext = createContext();

export function ProjectProvider({ children, project }) {
  const [projectName, setProjectName] = useState(project.project_name);
  const [members, setMembers] = useState(project.team_members);
  // console.log(project);
  // console.log(project.team_members);
  return (
    <ProjectContext.Provider value={{
      projectName, setProjectName,
      members, setMembers
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export default ProjectContext;
