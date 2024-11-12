import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaArrowLeft, FaPlus, FaSearch } from "react-icons/fa";
import { ProjectCard } from "../components/ProjectCard";
import { CreateProject } from "../components/modal/CreateProject";
import { fetchProjectsByUser, getUserProfile } from "../api/todolist.api";
import { Sidebar } from "../components/Sidebar";
import { useProjectFilter } from "../hook/useProjectFilter";
import SubTitleLabel from "../components/atoms/SubTitleLabel";
import TitleLabel from "../components/atoms/TitleLabel";
import EditProject from "../components/modal/EditProject";
import { LoadingSpinner } from "../components/LoadingSpinner";

export function HomePage() {
  const [projects, setProjects] = useState([]);
  const { filteredProjects, searchTerm, setFilter, handleSearch } = useProjectFilter(projects);
  const [activeProjects, setActiveProjects] = useState();
  const [projectsCompleted, setProjectsCompleted] = useState();

  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const resUser = await getUserProfile(token);
          const id = resUser.data.id;
          const res = await fetchProjectsByUser(id, token);
          setProjects(res.data);
          setLoading(false);
          setActiveProjects(res.data.length);
          // console.log(res.data);
          GetCompletedProjects(res.data);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      }
    }
    getAllProjects();
  }, []);

  const GetCompletedProjects = (projects) => {
    const completed_amount = projects.filter(project => project.is_completed === true).length;
    const porcent = (completed_amount / projects.length) * 100;
    setProjectsCompleted(porcent.toFixed(1));
  }


  return (
    <div className="content">
      {/* MAIN-CONTAIN */}
      <div className="main-content-items">
        <div className="menu-project">
          <div className="menu-project">
            <TitleLabel label={'Projects'} />
            <input type="text"
              placeholder="Search projects..." />
          </div>
          <CreateProject addNewProject={addNewProject} />
        </div>
        <div className="main">
            {loading && <LoadingSpinner />}
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
      {/* SIDEBAR */}
      <Sidebar setFilter={setFilter}>
        <TitleLabel label={'Dashboard'} />
        <div className='card-section'>
          <h2>{activeProjects}</h2>
          <SubTitleLabel label={'Active projects'} />
        </div>
        <div className='card-section'>
          <h2>{projectsCompleted}%</h2>
          <SubTitleLabel label={'Projects completed'} />
        </div>
        <div className='card-section'>
          <h2>23</h2>
          <SubTitleLabel label={'Pending tasks'} />
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
  );
}
