import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import { FaArrowRight, FaWrench } from "react-icons/fa";

import { ProjectCard } from "../components/ProjectCard";
import { CreateProject } from "../components/modal/CreateProject";
import { fetchProjectsByUser, getUserProfile } from "../Api/todolist.api";


export function HomePage() {
  const navigate = useNavigate;
  const { logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);

  const handleLogout = () => {
    logout();
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
          const res = await fetchProjectsByUser(id, token);
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
        <div className="main-buttons">
          <CreateProject addNewProject={addNewProject} />
        </div>
        <div className="aux-buttons">
          <p onClick={handleLogout}><FaArrowRight /></p>
          <p><FaWrench /></p>
        </div>
      </div>
      <div className="filtter">
        <div style={{ backgroundColor: 'green' }}>Filtrado</div>
        <div className="main">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} updateDataProject={updateDataProject} removeProject={removeProject} />
          ))}
        </div>
      </div>
    </div>
  )
}