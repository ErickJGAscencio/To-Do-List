import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import { ProjectCard } from "../components/ProjectCard";
import { CreateProject } from "../components/modal/CreateProject";

import { getUserProfile } from "../Api/todolist.api";
import { fetchAllProjects } from "../Api/todolist.api";

export function HomePage({ filter }) {
  const navigate = useNavigate;
  const { logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);

  const addNewProject = (newProject) => {
    setProjects([...projects, newProject]);
  };

  const updateProjectInList = (updatedProject) => {
    console.log(updatedProject);
    const updatedProjects = projects.map((project) =>
      project.pro === updatedProject.id ? updatedProject : project
    );
    setProjects(updatedProjects);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
          console.error(error);
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
        <CreateProject addNewProject={addNewProject} />
        <CreateProject addNewProject={addNewProject} />
        <CreateProject addNewProject={addNewProject} />
        <CreateProject addNewProject={addNewProject} />
        <div className="aux-buttons">
          <button onClick={handleLogout}>L</button>
          <button>S</button>
        </div>
      </div>

      <div className="main">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} updateProjectInList={updateProjectInList}
          />
        ))}
      </div>
    </div>
  )
}