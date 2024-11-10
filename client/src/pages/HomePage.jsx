import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaPlus, FaSearch } from "react-icons/fa";
import { ProjectCard } from "../components/ProjectCard";
import { CreateProject } from "../components/modal/CreateProject";
import { fetchProjectsByUser, getUserProfile } from "../api/todolist.api";
import { Sidebar } from "../components/Sidebar";
import { useProjectFilter } from "../hook/useProjectFilter";
import SubTitleLabel from "../components/atoms/SubTitleLabel";

export function HomePage() {
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



  // Función que se llama cuando se termina el drag-and-drop
  const handleOnDragEnd = (result) => {
    if (!result.destination) return; // Si el elemento no se suelta en un lugar válido

    const reorderedProjects = Array.from(projects);
    const [movedProject] = reorderedProjects.splice(result.source.index, 1); // Quita el proyecto movido
    reorderedProjects.splice(result.destination.index, 0, movedProject); // Inserta el proyecto en la nueva posición

    setProjects(reorderedProjects); // Actualiza el estado con el nuevo orden
  };



  return (
    <div className="main-main-container">
      <div className="main-container">
        <div className="menu">
          <div>
            <p>Projects</p>
            <input type="text"
              placeholder="Search projects..." />
          </div>
          <div>
            <button><FaPlus />Create new project</button>
          </div>
        </div>
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
      <div>
        <Sidebar setFilter={setFilter}>
          <p>Dashboard</p>
          <div className='card-section'>
            <h2>3</h2>
            <p>Active projects</p>
          </div>
          <div className='card-section'>
            <h2>33%</h2>
            <p>Projects completed</p>
          </div>
          <div className='card-section'>
            <h2>23</h2>
            <p>Pending tasks</p>
          </div>

          <div className='deadline-section'>
            <h5>Upcoming Deadlines</h5>
            <div className='deadline-list'>
              <SubTitleLabel label={'Grand Mansion Tokyo:'} />
              <SubTitleLabel label={'2024-02-08'} />
            </div>
            <div className='deadline-list'>
              <SubTitleLabel label={'Workcloud:'} />
              <SubTitleLabel label={'2024-02-08'} />
            </div>
            <div className='deadline-list'>
              <SubTitleLabel label={'Grand Mansion Tokyo:'} />
              <SubTitleLabel label={'2024-02-08'} />
            </div>
          </div>
        </Sidebar>
      </div>
    </div>
  );
}
