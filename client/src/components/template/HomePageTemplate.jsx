import React, { useEffect, useState } from 'react'
import SubTitleLabel from '../atoms/SubTitleLabel';
import { Sidebar } from '../Sidebar';
import { ProjectCard } from '../ProjectCard';
import { LoadingSpinner } from '../LoadingSpinner';
import CreateProject from '../modal/CreateProject';
import TitleLabel from '../atoms/TitleLabel';
import { useProjectFilter } from '../../hook/useProjectFilter';
import { fetchProjectsByUser, getUserProfile } from '../../api/todolist.api';

function HomePageTemplate() {
  const [projects, setProjects] = useState([]);
  const { filteredProjects, setFilter } = useProjectFilter(projects);
  const [loading, setLoading] = useState(false);

  // Dashboard
  const [activeProjects, setActiveProjects] = useState("");
  const [projectsCompleted, setProjectsCompleted] = useState("");
  const [pendingTasks, setPendingTasks] = useState("");


  const addNewProject = (newProject) => {
    console.log("adding project");

    setProjects([...projects, newProject]);
  };

  const removeProject = (idToRemove) => {
    setProjects(projects.filter((project) => project.id !== idToRemove));
  };

  const updateDataProject = (updatedProject) => {
    console.log("updatingProject");
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
          GetCompletedProjects(res.data);
          // setPendingTasks(pendingTasks);

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
          <div className="menu-group">
            <TitleLabel label={'My Projects'} />
            <input
              type="text"
              placeholder="Search projects..." />
          </div>
          {/* <Modal label={ 'asd' } /> */}
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
        <div>
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
          <h2>{pendingTasks}--</h2>
            <SubTitleLabel label={'Pending tasks'} />
          </div>
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

export default HomePageTemplate