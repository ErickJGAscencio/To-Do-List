import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaSearch } from "react-icons/fa";
import { ProjectCard } from "../components/ProjectCard";
import { CreateProject } from "../components/modal/CreateProject";
import { fetchProjectsByUser, getUserProfile } from "../api/todolist.api";
import { Sidebar } from "../components/Sidebar";
import { useProjectFilter } from "../hook/useProjectFilter";

export function HomePage() {
  const navigate = useNavigate;
  const { logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const { filteredProjects, searchTerm, setFilter, handleSearch } = useProjectFilter(projects);

  const addNewProject = (newProject) => {
    setProjects([...projects, newProject]);
  };

  const removeProject = (idToRemove) => {
    setProjects(projects.filter((project) => project.id !== idToRemove));
  };

  const updateDataProject = (updatedProject) => {
    const updatedProjects = projects.map((project) =>
      project.id === updatedProject.id ? updatedProject : project
    );
    setProjects(updatedProjects);
  };

  useEffect(() => {
    async function getAllProjects() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const resUser = await getUserProfile(token);
          const id = resUser.data.id;
          const res = await fetchProjectsByUser(id, token);
          setProjects(res.data);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      }
    }
    getAllProjects();
  }, []);

  return (
    <div>
      <div className="main-container">
        <Sidebar setFilter={setFilter}>
          <CreateProject addNewProject={addNewProject} />
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search projects..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </Sidebar>
        <div className="main">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              updateDataProject={updateDataProject}
              removeProject={removeProject}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
