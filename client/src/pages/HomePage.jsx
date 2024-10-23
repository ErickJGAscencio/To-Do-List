import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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



  // Función que se llama cuando se termina el drag-and-drop
  const handleOnDragEnd = (result) => {
    if (!result.destination) return; // Si el elemento no se suelta en un lugar válido

    const reorderedProjects = Array.from(projects);
    const [movedProject] = reorderedProjects.splice(result.source.index, 1); // Quita el proyecto movido
    reorderedProjects.splice(result.destination.index, 0, movedProject); // Inserta el proyecto en la nueva posición

    setProjects(reorderedProjects); // Actualiza el estado con el nuevo orden
  };



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

  // return (
  //   <div>
  //     <DragDropContext onDragEnd={handleOnDragEnd}>
  //       <div className="main-container">

  //         <Sidebar setFilter={setFilter}>
  //           <CreateProject addNewProject={addNewProject} />
  //           <div className="search-bar">
  //             <FaSearch className="search-icon" />
  //             <input
  //               type="text"
  //               placeholder="Search projects..."
  //               className="search-input"
  //               value={searchTerm}
  //               onChange={(e) => handleSearch(e.target.value)}
  //             />
  //           </div>
  //         </Sidebar>

  //         <Droppable droppableId="projects">
  //           {(provided) => (
  //             <div {...provided.droppableProps} ref={provided.innerRef}>
  //               {filteredProjects.map((project, index) => (
  //                 <Draggable key={project.id} draggableId={String(project.id)} index={index}>
  //                   {(provided) => (
  //                     <div
  //                       ref={provided.innerRef}
  //                       {...provided.draggableProps}
  //                       {...provided.dragHandleProps}
  //                     >
  //                       <ProjectCard
  //                         project={project}
  //                         updateDataProject={updateDataProject}
  //                         removeProject={removeProject}
  //                       />
  //                     </div>
  //                   )}
  //                 </Draggable>
  //               ))}
  //               {provided.placeholder}
  //             </div>
  //           )}
  //         </Droppable>

  //       </div>
  //     </DragDropContext>

  //   </div>
  // );
}
