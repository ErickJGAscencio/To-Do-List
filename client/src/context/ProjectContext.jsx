import React, { createContext, useState } from 'react';

export const ProjectContext = createContext();

export function ProjectProvider({ children, project }) {
  const [projectName, setProjectName] = useState(project.project_name);
  const [projectDescription, setProjectDescription] = useState(project.description);
  const [members, setMembers] = useState(project.team_members);
  // console.log(project);
  // console.log(project.team_members);
  return (
    <ProjectContext.Provider value={{
      projectName, setProjectName,
      projectDescription, setProjectDescription,
      members, setMembers
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export default ProjectContext;
