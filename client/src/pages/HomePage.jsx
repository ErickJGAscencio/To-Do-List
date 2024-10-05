import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import { ProjectCard } from "../components/ProjectCard";
import { CreateProject } from "../components/modal/CreateProject";
import { fetchAllProjects, getUserProfile } from "../api/todolist.api";


export function HomePage() {
  const navigate = useNavigate;
  const { logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const addNewProject = (newProject) => {
    setProjects([...projects, newProject]);
  };

  const removeProject = (idToRemove) => {
    setProjects(projects.filter((project) => project.id !== idToRemove));
  }

  const updateDataProject = (updatedProject) => {
    console.log(updatedProject);
    const updatedProjects = projects.map((project) =>
      project.id === updatedProject.id ? updatedProject : project
    );
    setProjects(updatedProjects);
  };

  useEffect(() => {
    async function getAllPjcts() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const resUser = await getUserProfile(token);
          const id = resUser.data.id;
          const res = await fetchAllProjects(id, token);
          setProjects(res.data);
        } catch (error) {
          setError(error.message);
        }
      }
    }
    getAllPjcts();
  }, []);

  useEffect(() => {
    setProjects(projects);
  }, [projects])

  return (
    <div>
      <div className="aside">
        <div className="action-btn">
          <CreateProject addNewProject={addNewProject} />
          <p onClick={handleLogout}>Log Out</p>
          <p>Settings</p>
        </div>
      </div>

      <div className="main">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} updateDataProject={updateDataProject} removeProject={removeProject} />
        ))}
      </div>
    </div>
  )
}