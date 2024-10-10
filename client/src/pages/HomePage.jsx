import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import { FaSignOutAlt, FaCogs, FaSearch, FaThList, FaClipboardCheck, FaHourglassHalf } from "react-icons/fa";

import { ProjectCard } from "../components/ProjectCard";
import { CreateProject } from "../components/modal/CreateProject";
import { fetchProjectsByUser, getUserProfile } from "../api/todolist.api";


export function HomePage() {
  const navigate = useNavigate;
  const { logout } = useContext(AuthContext);
  const [ projects, setProjects ] = useState([]);
  const [ projectsFiltered, setProjectsFiltered ] = useState([]);

  const handleLogout = () => {
    logout();
  };

  const addNewProject = (newProject) => {
    setProjects([...projects, newProject]);
    setProjectsFiltered([...projects, newProject]);
  };

  const removeProject = (idToRemove) => {
    setProjects(projects.filter((project) => project.id !== idToRemove));
  }

  const updateDataProject = (updatedProject) => {
    const updatedProjects = projects.map((project) =>
      project.id === updatedProject.id ? updatedProject : project
    );
    setProjects(updatedProjects);
  };

  const setFilter = (filter) => {
    console.log(filter);
    if (filter == "all") {
      setProjectsFiltered(projects);
    } else if (filter == "completed") {
      const completedProjects = projects.filter(project => project.is_completed === true);
      setProjectsFiltered(completedProjects);
    } else {
      const inProgressProjects = projects.filter(project => project.is_completed === false);
      setProjectsFiltered(inProgressProjects);
    }
  }

  useEffect(() => {
    async function getAllPjcts() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const resUser = await getUserProfile(token);
          const id = resUser.data.id;
          const res = await fetchProjectsByUser(id, token);
          setProjects(res.data);
          setProjectsFiltered(res.data); 
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
          <hr />
          <p className="create-btn" onClick={() => setFilter('all')}> <FaThList /> All</p>
          <p className="create-btn" onClick={() => setFilter('completed')}> <FaClipboardCheck /> Completed</p>
          <p className="create-btn" onClick={() => setFilter('inProgress')}> <FaHourglassHalf /> In Progress</p>
  
          {/* Búsqueda de proyectos */}
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search projects..."
              className="search-input"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
  
        <div className="aux-buttons">
          <p onClick={handleLogout}><FaSignOutAlt size={15} /></p>
          <p><FaCogs size={15} /></p>
        </div>
      </div>
  
      <div className="main-filter-contain">
        <div className="main">
          {projectsFiltered
            // .filter(project => project.name.toLowerCase().includes(searchTerm.toLowerCase())) // Filtra los proyectos según la búsqueda
            .map((project) => (
              <ProjectCard key={project.id} project={project} updateDataProject={updateDataProject} removeProject={removeProject} />
          ))}
        </div>
      </div>
    </div>
  )
}