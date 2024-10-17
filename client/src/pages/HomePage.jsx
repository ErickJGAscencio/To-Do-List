import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import { FaSignOutAlt, FaCogs, FaSearch, FaThList, FaClipboardCheck, FaHourglassHalf } from "react-icons/fa";

import { ProjectCard } from "../components/ProjectCard";
import { CreateProject } from "../components/modal/CreateProject";
import { fetchProjectsByUser, getUserProfile } from "../api/todolist.api";
import { Sidebar } from "../components/Sidebar";


export function HomePage() {
  const navigate = useNavigate;
  const { logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [projectsFiltered, setProjectsFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filtrar proyectos con base al estado
  const setFilter = (filter) => {
    if (filter === "all") {
      setProjectsFiltered(projects);

    } else if (filter === "completed") {
      const completedProjects = projects.filter(project => project.is_completed === true);
      setProjectsFiltered(completedProjects);

    } else if (filter === "inProgress") {
      const inProgressProjects = projects.filter(project => project.is_completed === false);
      setProjectsFiltered(inProgressProjects);
    }
  }

  // Filtrar proyectos con base en el término de búsqueda
  const getFilteredProjects = () => {
    if (searchTerm.trim() === '') {
      return projectsFiltered;
    } else {
      return projectsFiltered.filter(
        project => project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
          console.error('Error fetching projects:', error);
        }
      }
    }
    getAllPjcts();
  }, []);

  useEffect(() => {
    setProjects(projects);
    setFilter("all");
    // console.log(projects);
  }, [projects])


  const sidebarButtons = [
    { label: 'All', onClick: () => setFilter('all'), icon: FaThList },
    { label: 'Completed', onClick: () => setFilter('completed'), icon: FaClipboardCheck },
    { label: 'In Progress', onClick: () => setFilter('inProgress'), icon: FaHourglassHalf }
  ];

  const createButton = [
    
  ]

  return (
    <div>
      <Sidebar buttons={sidebarButtons}>
        <CreateProject addNewProject={addNewProject} />
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search projects..."
            className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Método para actualizar el término de búsqueda
          />
        </div>
      </Sidebar>
      <div className="main-filter-contain">
        <div className="main">
          {getFilteredProjects().map((project) => (
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
  )
}
